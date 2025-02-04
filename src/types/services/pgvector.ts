import client from '@lib/postgres-client.ts';
import {Prisma} from "@prisma/client"
import pgvector from 'pgvector';
import prisma from '@lib/prisma.ts';

export const queryRecipe = async (embed: {
	ingredients: number[],
	name: number[],
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

	const query = `
					SELECT
							id,
--               id AS recipe_id,
--               title,
--               link,
--               thumbnail,
--               quantitative,
--               "ingredientTitle",
--               "ingredientMarkdown",
--               "stepMarkdown",
                (
                0.5 * (embeded_ingredient <=> $1::vector(768))
                + 0.5 * (embeded_name <=> $2::vector(768))
            		)AS distance
					FROM "public"."Recipe"
					ORDER BY distance
          LIMIT 10
--       WITH closest_recipes AS (
--           SELECT
--               id AS recipe_id,
--               title,
--               link,
--               thumbnail,
--               quantitative,
--               "ingredientTitle",
--               "ingredientMarkdown",
--               "stepMarkdown",
--               embeded <=> $1::vector AS distance
-- 					FROM "public"."Recipe"
-- 					ORDER BY distance
--           LIMIT 10
--    	)
--       SELECT
--           cr.recipe_id,
--           cr.title,
--           cr.link,
--           cr.quantitative AS "quantitative",
--           cr."ingredientTitle" AS "ingredient_title",
--           cr."ingredientMarkdown" AS "ingredient_markdown",
--           cr."stepMarkdown" AS "step_markdown",
--           cr.thumbnail,
--           (1 - cr.distance) AS similarity_score,  -- Chỉ số tương tự (1 - distance)
--           jsonb_agg(
--                   jsonb_build_object(
--                           'id', s.id,
--                           'index', s.index,
--                           'title', s.title,
--                           'content', s.content,
--                           'box_gallery', s."boxGallery"
--                   )
--           ) FILTER (WHERE s.id IS NOT NULL) AS "tutorial_step",
--               jsonb_agg(
--                       jsonb_build_object(
--                               'id', i.id,
--                               'name', i.name,
--                               'quantity', i.quantity
--                       )
--               ) FILTER (WHERE i.id IS NOT NULL) AS ingredients
--       FROM closest_recipes cr
--                LEFT JOIN "public"."Step" s ON cr.recipe_id = s."recipeId"
--                LEFT JOIN "public"."Ingredient" i ON cr.recipe_id = i."recipeId"
--       GROUP BY cr.recipe_id, cr.title, cr.link, cr.thumbnail, cr.distance, cr.quantitative, cr."ingredientTitle", cr."ingredientMarkdown", cr."stepMarkdown"
--       ORDER BY similarity_score DESC;  -- Sắp xếp theo độ tương tự cao nhất
	`;

	const res = await client.query<Prisma.RecipeGetPayload<{
		select: {
			id: true,
		},
	}>>(query, [embeddedIngredientVector, embeddedNameVector]);
	const result = res.rows;
	console.log('result', result);

	const queryDetail = await prisma.recipe.findMany({
		where: {
			id: {
				in: result.map(r => r.id)
			}
		},
		include: {
			ingredients: true,
			tutorialSteps: true
		}
	});
	return queryDetail;
}