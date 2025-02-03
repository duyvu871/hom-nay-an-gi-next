import { atom } from 'jotai';
import { Recipe } from '@schema/recipe-schema.ts';

export const recipeActiveAtom = atom<Recipe | null>(null);
export const recipeListAtom = atom<Recipe[]>([]);