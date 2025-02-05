import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import zlib from 'zlib';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { pick } from 'stream-json/filters/Pick';
import { ignore } from 'stream-json/filters/Ignore';
import { streamValues } from 'stream-json/streamers/StreamValues';
import * as process from 'node:process';
import * as path from 'node:path';
import Success from '@util/response/successful/Success.ts';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import { GeminiChatService } from '@lib/llm/gemini.ts';
import { parseContent } from '@util/parse.ts';
import { queryRandomRecipe, queryRecipe } from '@service/pgvector.ts';

const asyncPipeline = promisify(chain);

export const validateBody = z.object({
	prompt: z.string({
		message: 'Prompt is required'
	}),
	type: z.enum(["random", "ai-agent"], {
		message: 'Type is required'
	})
});

export type RecommendationBody = z.infer<typeof validateBody>;

export async function POST(req: NextRequest) {
	try {
		const body = await req.json() as RecommendationBody;
		const { prompt, type } = validateBody.parse(body);

		// random recipe recommendation
		if (type === "random") {
			const embedQuery = await queryRandomRecipe();

			const success = new Success({
				message: "Đây là một số món ăn ngẫu nhiên dành cho Trup ",
				recipes: embedQuery,
			}).toJson;
			return NextResponse.json(success);

		}
		// ai-agent recipe recommendation
		else if (type === "ai-agent") {

			const llm = new GeminiChatService(process.env.GEMINI_API_KEY);

			const recommendation = await llm.sendMessage({
				textContent: prompt,
				mediaContent: [],
			}, []);

			if (recommendation.error) {
				return NextResponse.json({
					status: 500,
					message: recommendation.error,
				});
			}

			const recommendationResponse = recommendation.answer;
			const parsedResponse = parseContent(recommendationResponse);

			if ("error" in parsedResponse) {
				return NextResponse.json({
					status: 500,
					error: parsedResponse.error,
				});
			}

			const ai = parsedResponse.ai;
			const embedding = parsedResponse.embedding;

			console.log('ai', ai);
			console.log('embedding', embedding);
			// const embedIngredientVector = await llm.generateEmbedding(embedding.ingredient);
			// const embedNameVector = await llm.generateEmbedding(embedding.name);

			const [embedIngredientVector, embedNameVector] = await Promise.all([
				llm.generateEmbedding(embedding.ingredient),
				llm.generateEmbedding(embedding.name),
			]); // [embedIngredientVector, embedNameVector]

			const embedQuery = await queryRecipe({
				ingredients: embedIngredientVector,
				name: embedNameVector,
			});

			const success = new Success({
				message: ai,
				recipes: embedQuery,
			}).toJson;
			return NextResponse.json(success);
		}
	} catch (error) {
		console.log('error', error);
		if (error instanceof z.ZodError) {
			const message = error.errors[0].message;
			return NextResponse.json({
				status: 400,
				error: message,
			});
		}

		return NextResponse.json({
			status: 500,
			error: 'Internal Server Error',
		});
	}
}