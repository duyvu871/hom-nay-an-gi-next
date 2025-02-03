import axiosWithAuth from '@lib/axios.ts';
import { Pagination, SuccessResponse } from '@type/apis/response.ts';
import { Recipe } from '@schema/recipe-schema.ts';

export const getRecommendationFromRecipe = async (prompt: string) => {
		try {

				const response = await axiosWithAuth.post<SuccessResponse<{
					message: string;
					recipes: Recipe[];
				}>>(`/recommendation`, {
						prompt,
				});

				return response.data.data;
		} catch (error) {
				throw error;
		}
}