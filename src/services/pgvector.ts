import client from '@lib/postgres-client.ts';
import {Prisma} from "@prisma/client"
import pgvector from 'pgvector';
import prisma from '@lib/prisma.ts';

export const queryRecipe = async (embed: {
	ingredients: number[],
	name: number[],
	ingredientString: string,
	nameString: string,
}) => {

	if (!embed) {
		console.log('embed', embed);
		throw new Error('Embedding is required');
	}

	if (!embed.ingredients || !embed.name) {
		console.log('embed', embed);
		throw new Error('Embedding is required');
	}

	const embeddedIngredientVector = pgvector.toSql(embed.ingredients);
	const embeddedNameVector = pgvector.toSql(embed.name);

	const parseName = embed.ingredientString.split(',').map(i => i.trim().split(' ')).flat();
	const parseIngredient = embed.nameString.split(',').map(i => i.trim().split(' ')).flat();

	const query = `
      WITH word_matches AS (
          SELECT
              r.id AS recipe_id,
              r.title,
              r."ingredientTitle",
              (
                  SELECT COUNT(*)
                  FROM unnest($3::text[]) AS word
                  WHERE LOWER(r.title) LIKE '%' || LOWER(word) || '%'
              ) AS name_match_count,
              (
                  SELECT COUNT(*)
                  FROM unnest($4::text[]) AS word
                  WHERE LOWER(r."ingredientTitle") LIKE '%' || LOWER(word) || '%'
              ) AS ingredient_match_count
          FROM "public"."Recipe" r
          GROUP BY r.id, r.title, r."ingredientTitle"
          HAVING
              (
                  SELECT COUNT(*)
                  FROM unnest($3::text[]) AS word
                  WHERE LOWER(r.title) LIKE '%' || LOWER(word) || '%'
              ) >= 3
              AND
              (
                  SELECT COUNT(*)
                  FROM unnest($4::text[]) AS word
                  WHERE LOWER(r."ingredientTitle") LIKE '%' || LOWER(word) || '%'
              ) >= 5
      ),
      closest_recipes AS (
          SELECT
              id AS recipe_id,
              r.title,
              r.link,
              r.thumbnail,
              r.quantitative,
              r."ingredientTitle",
              r."ingredientMarkdown",
              r."stepMarkdown",
              (0.5 * (r.embeded_ingredient <=> $1::vector(768)) + 0.5 * (r.embeded_name <=> $2::vector(768))) AS distance
          FROM word_matches
		  JOIN "public"."Recipe" r ON r.id = word_matches.recipe_id
          ORDER BY distance
          LIMIT 10
          ),
-- Tổng hợp các bước (steps) cho từng công thức
          steps_aggregated AS (
						SELECT
								cr.recipe_id,
								jsonb_agg(
									jsonb_build_object(
										'id', step.id,
										'index', step.index,
										'title', step.title,
										'content', step.content,
										'box_gallery', step."boxGallery"
									)
								) FILTER (WHERE step.id IS NOT NULL) AS tutorial_step
						FROM closest_recipes AS cr
								LEFT JOIN "public"."Step" AS step ON cr.recipe_id = step."recipeId"
						GROUP BY cr.recipe_id
          ),
					-- Tổng hợp các nguyên liệu (ingredients) cho từng công thức
          ingredients_aggregated AS (
						SELECT
								cr.recipe_id,
								jsonb_agg(
									jsonb_build_object(
										'id', ingredient.id,
										'name', ingredient.name,
										'quantitative', ingredient.quantity,
										'unit', ingredient.unit
									)
								) FILTER (WHERE ingredient.id IS NOT NULL) AS ingredients
						FROM closest_recipes AS cr
								LEFT JOIN "public"."Ingredient" AS ingredient ON cr.recipe_id = ingredient."recipeId"
						GROUP BY cr.recipe_id
          )
			-- Kết hợp kết quả từ các CTE trên
      SELECT
          cr.recipe_id,
          cr.title,
          cr.link,
          cr.thumbnail,
          cr.quantitative AS "quantitative",
          cr."ingredientTitle" AS "ingredient_title",
          cr."ingredientMarkdown" AS "ingredient_markdown",
          cr."stepMarkdown" AS "step_markdown",
          (1 - cr.distance) AS similarity_score,
          sa.tutorial_step,
          ia.ingredients
      FROM closest_recipes AS cr
        LEFT JOIN steps_aggregated AS sa ON cr.recipe_id = sa.recipe_id
    		LEFT JOIN ingredients_aggregated AS ia ON cr.recipe_id = ia.recipe_id
      ORDER BY similarity_score DESC;
	`;

	const res = await client.query(query, [embeddedIngredientVector, embeddedNameVector, parseName, parseIngredient]);
	const result = res.rows;
	console.log('result', result.map(r => ({
		// @ts-ignore
		id: r.recipe_id,
		// @ts-ignore
		similarity_score: r.similarity_score as number,
	})));

	// const queryDetail = await prisma.recipe.findMany({
	// 	where: {
	// 		id: {
	// 			in: result.map(r => r.id)
	// 		}
	// 	},
	// 	include: {
	// 		ingredients: true,
	// 		tutorialSteps: true
	// 	}
	// });
	// const parsedQueryDetail = queryDetail.map(qd => {
	// 	const {tutorialSteps, ...rest} = qd;
	// 	return ({
	// 		...rest,
	// 		tutorial_step: tutorialSteps
	// 	})
	// });

	return result;
}

export const queryRandomRecipe = async () => {
	const query = `
      WITH random_recipes AS (
          SELECT
              id AS recipe_id,
              title,
              link,
              thumbnail,
              quantitative,
              "ingredientTitle",
              "ingredientMarkdown",
              "stepMarkdown",
              RANDOM() AS random_score  -- Generate random score
          FROM word_matches
          ORDER BY random_score
          LIMIT 10
          ),
          steps_aggregated AS (
      SELECT
          rr.recipe_id,
          jsonb_agg(
						jsonb_build_object(
							'id', step.id,
							'index', step.index,
							'title', step.title,
							'content', step.content,
							'box_gallery', step."boxGallery"
						)
          ) FILTER (WHERE step.id IS NOT NULL) AS tutorial_step
      FROM random_recipes AS rr
          LEFT JOIN "public"."Step" AS step ON rr.recipe_id = step."recipeId"
      GROUP BY rr.recipe_id
          ),
          ingredients_aggregated AS (
      SELECT
          rr.recipe_id,
          jsonb_agg(
						jsonb_build_object(
							'id', ingredient.id,
							'name', ingredient.name,
							'quantitative', ingredient.quantity,
							'unit', ingredient.unit
						)
          ) FILTER (WHERE ingredient.id IS NOT NULL) AS ingredients
      FROM random_recipes AS rr
          LEFT JOIN "public"."Ingredient" AS ingredient ON rr.recipe_id = ingredient."recipeId"
      GROUP BY rr.recipe_id
          )
      SELECT
          rr.recipe_id,
          rr.title,
          rr.link,
          rr.thumbnail,
          rr.quantitative AS "quantitative",
          rr."ingredientTitle" AS "ingredient_title",
          rr."ingredientMarkdown" AS "ingredient_markdown",
          rr."stepMarkdown" AS "step_markdown",
          rr.random_score AS similarity_score,  -- Use random_score as similarity_score
          sa.tutorial_step,
          ia.ingredients
      FROM random_recipes AS rr
               LEFT JOIN steps_aggregated AS sa ON rr.recipe_id = sa.recipe_id
               LEFT JOIN ingredients_aggregated AS ia ON rr.recipe_id = ia.recipe_id
      ORDER BY similarity_score DESC;
	`;

	const res = await client.query(query);
	const result = res.rows;

	return result;
}