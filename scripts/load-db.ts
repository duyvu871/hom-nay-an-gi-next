import { GeminiChatService } from "@lib/llm/gemini";
import process from "node:process";
import pLimit from 'p-limit';
import fs from "fs";
import path from "node:path";
import zlib from "zlib";
import { configDotenv } from "dotenv";
import StreamArray from "stream-json/streamers/StreamArray";
import { Recipe } from "@schema/recipe-schema.ts";
import { timeout } from "@util/delay.ts"
import {
	PrismaClient,
	Recipe as PrismaRecipe,
	Ingredient,
	Step,
	Prisma
} from '@prisma/client';
import pgvector from 'pgvector';
import { Pool, PoolClient } from 'pg';
import { toLowerCaseNonAccentVietnamese } from '@util/non-acent-vietnam.ts';
import pQueue from 'p-queue';

// Load environment variables correctly
const env = configDotenv({ path: path.resolve(__dirname, "../.env.local") }).parsed;

console.log("Loaded Environment:", env);

if (!env) throw new Error("Environment variables not loaded");

const prismaClientSingleton = (): PrismaClient => {
	return new PrismaClient({
		log: ['query', 'info', 'warn', 'error'],
		datasources: {
			db: {
				url: env.DATABASE_URL,
			}
		}
	});
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
	interface BigInt {
		toJSON(): string;
	}
}

BigInt.prototype.toJSON = function () {
	return this.toString();
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

prisma.$use(async (params, next) => {
	const before = Date.now();

	const result = await next(params);

	const after = Date.now();

	console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

	return result;
})

const pool = new Pool({ connectionString: env.DATABASE_URL });

const loadDb = async () => {
	try {
		// Ensure API key is available
		const apiKey = env.GEMINI_API_KEY;
		if (!apiKey) throw new Error("GEMINI_API_KEY is missing from .env file");

		const llm = new GeminiChatService(env.GEMINI_API_KEY);
		// Đường dẫn đến file nén
		const filePath = path.resolve(__dirname, "../resources/recipes.json.gz");
		// Tạo ReadStream từ file Gzip JSON
		const fileStream = fs.createReadStream(filePath);
		// Giải nén file Gzip
		const gunzipStream = zlib.createGunzip();
		// Tạo StreamArray để đọc JSON
		const jsonStream = StreamArray.withParser();

		// Create a rate limiter: 150 requests per minute
		const queue = new pQueue({
			concurrency: 1,
			interval: 60 * 1000, // 1 minute
			intervalCap: 150 // max 150 tasks per interval
		});

		const recipes: Recipe[] = [];

		// Xử lý từng phần tử trong JSON array
		jsonStream.on(
			"data",
			async ({ key, value }: { key: number; value: Recipe }) => {
				// console.log("Processing recipe:", value);
				recipes.push(value);
			}
		);

		// Bắt lỗi nếu có vấn đề khi đọc file
		jsonStream.on("error", (err: any) => {
			console.error("Error reading JSON stream:", err);
		});

		// Xử lý khi hoàn thành
		jsonStream.on("end", async () => {
			console.log("Finished processing JSON array.");
			for (let i = 0; i < recipes.length; i++) {
				// 
				const value = recipes[i];
				await timeout(1000);
				const client = await pool.connect();
				try {

					await client.query("BEGIN");

					// const [embeddedName, embeddedIngredient] = await Promise.all([
					// 	llm.generateEmbedding([
					// 		value.title || "",
					// 		value.tutorial || "",
					// 	].join(", ")),
					// 	llm.generateEmbedding([
					// 		value.ingredient_title || "",
					// 		value.ingredients.map(ingredient => ingredient.name || "").join(", "),
					// 		value.quantitative || "",
					// 	].join(", "))
					// ])

					const embeddedName = await llm.generateEmbedding([
						value.title || "",
						value.tutorial || "",
					].join(", "));
					console.log("Embedded name:", embeddedName.length);
					
					const embeddedIngredient = await llm.generateEmbedding([
						value.ingredient_title || "",
						value.ingredients.map(ingredient => ingredient.name || "").join(", "),
						value.quantitative || "",
					].join(", "));

					console.log("Embedded ingredient:", embeddedIngredient.length);

					const embeddedNameVector = pgvector.toSql(embeddedName);
					const embeddedIngedientVector = pgvector.toSql(embeddedIngredient);
					const recipeResult = await client.query(
						`INSERT INTO "Recipe" (
				  "id", 
					"link", 
					"title", 
				"thumbnail", 
				"tutorial", 
				"quantitative", 
				"ingredientTitle", 
				"ingredientMarkdown",
				"stepMarkdown", 
				"embeded_name",
					"embeded_ingredient",
				"createdAt", 
				"updatedAt"
			  ) VALUES (
				  gen_random_uuid(), 
				$1,
				$2,
				$3, 
				$4, 
				$5, 
				$6, 
				$7, 
				$8, 
				$9,
				$10,
				NOW(),
				NOW()
			  ) RETURNING id`,
						[
							value.link || "",
							value.title || "",
							value.thumbnail || "",
							value.tutorial || "",
							value.quantitative || "",
							value.ingredient_title || "",
							value.ingredient_markdown || "",
							value.step_markdown || "",
							embeddedNameVector,
							embeddedIngedientVector
						]
					);
					const recipeId = recipeResult.rows[0].id;

					if (value.ingredients?.length) {
						const ingredientValues = value.ingredients.map(ingredient => [
							recipeId, ingredient.name || "", ingredient.quantitative || "", ingredient.unit || ""
						]);
						await client.query(`
			  INSERT INTO "Ingredient" ("id", "recipeId", "name", "quantity", "unit") 
			  VALUES ${ingredientValues.map((_, i) => `(gen_random_uuid(), $${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(",")}`,
							ingredientValues.flat()
						);
					}

					if (value.tutorial_step?.length) {
						const stepValues = value.tutorial_step.map(step => [
							recipeId, step.index || 0, step.title || "", step.content || "", step.box_gallery || []
						]);
						await client.query(`
				INSERT INTO "Step" ("id", "recipeId", "index", "title", "content", "boxGallery")
				VALUES ${stepValues
								.map((_, i) => `(gen_random_uuid(), $${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
								.join(",")}`,
							stepValues.flat()
						);
					}

					await client.query("COMMIT");
				} catch (error) {
					await client.query("ROLLBACK");
					console.error(i, "Error inserting recipe:", error);
				} finally {
					client.release();
					console.log(`Inserted recipe ${i}`);
				}
			}
		});

		// connect stream: file -> gunzip -> jsonStream
		fileStream.pipe(gunzipStream).pipe(jsonStream.input);

		
	} catch (error) {
		console.error("Error loading database:", error);
	}
};

loadDb();


const BATCH_SIZE = 100; // Adjust based on memory/API limits
const CONCURRENCY = 5; // Gemini API rate limit friendly

const processBatch = async (client: PoolClient, batch: Prisma.RecipeGetPayload<{ include: { ingredients: true, tutorialSteps: true } }>[], apiKey: string) => {
	const llm = new GeminiChatService(apiKey);
	const queries = [];

	for (const recipe of batch) {
		const embeddingText = [
			`Title: ${toLowerCaseNonAccentVietnamese(recipe.title || '')}`,
			`Ingredients: ${toLowerCaseNonAccentVietnamese(recipe.ingredients.map(ingredient => ingredient.name || '').join(', '))}`,
			`Quantities: ${toLowerCaseNonAccentVietnamese(recipe.quantitative)}`,
			`Tutorial: ${toLowerCaseNonAccentVietnamese(recipe.tutorial)}`,
			`Steps: ${toLowerCaseNonAccentVietnamese(recipe.tutorialSteps.map(step => step.title || '').join(', '))}`,
		].join("\n");

		queries.push((async () => {
			try {
				const embedded = await llm.generateEmbedding(embeddingText);
				return {
					id: recipe.id,
					vector: pgvector.toSql(embedded)
				};
			} catch (error) {
				console.error(`Failed embedding for recipe ${recipe.id}:`, error);
				return null;
			}
		})());
	}

	const results = (await Promise.all(queries)).filter(Boolean);

	await client.query("BEGIN");
	try {
		for (const updatedEmbed of results) {
			if (!updatedEmbed) continue;
			const { id, vector } = updatedEmbed;
			await client.query(
				`UPDATE "Recipe" SET "embeded" = $1 WHERE "id" = $2`,
				[vector, id]
			);
		}
		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	}
};

const updateRecipeEmbeddings = async () => {
	const apiKey = env.GEMINI_API_KEY;
	if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

	const client = await pool.connect();
	try {
		const totalRecipes = await prisma.recipe.count();
		const queue = new pQueue({ concurrency: CONCURRENCY });

		for (let offset = 0; offset < totalRecipes; offset += BATCH_SIZE) {
			queue.add(async () => {
				const batch = await prisma.recipe.findMany({
					skip: offset,
					take: BATCH_SIZE,
					include: { ingredients: true, tutorialSteps: true }
				});

				console.log(`Processing batch ${offset / BATCH_SIZE + 1}`);
				await processBatch(client, batch, apiKey);
			});
		}

		await queue.onIdle();
	} finally {
		client.release();
	}
};

// updateRecipeEmbeddings();