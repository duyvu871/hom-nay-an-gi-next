
"use client"

import React, { useEffect, useState } from 'react';
// import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Image } from "@heroui/image"
import { Button } from "@heroui/button"
import { Recipe } from '@schema/recipe-schema.ts';
import RecipeViewer from '@component/Recipe/recipe-view.tsx';
import { separateArray, separateArrayByTotalBatch } from '@util/number.ts';
import { Chip } from '@heroui/chip';
import GradientBlobs from '@component/HeroSection/gradient-blobs.tsx';
import { AnimatedGradientBorderTW } from '@component/HeroSection/animated-gradient-border.tsx';

interface RecipeListProps {
	recipes: Recipe[]
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

	const separateRecipe = separateArrayByTotalBatch(recipes, 3);

	useEffect(() => {
		setSelectedRecipe(null)
	}, [recipes]);

	return (
		<div className="max-w-6xl mx-auto my-4">

			{selectedRecipe ? (
				<div>
					<Button onPress={() => setSelectedRecipe(null)} className="mb-4 bg-primary font-semibold text-white"
									variant="flat">
						Trở lại danh sách
					</Button>
					<RecipeViewer recipe={selectedRecipe} />
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{separateRecipe.map((recipes, index) => (
						<div className={"flex flex-col justify-start items-start gap-6"}>
							{recipes.map((recipe, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
								>
									<Card
										isPressable
										onPress={() => setSelectedRecipe(recipe)}
										className=" hover:shadow-lg transition-shadow duration-300 rounded-3xl"
									>
										<CardBody className="overflow-visible ">
											{/*<AnimatedGradientBorderTW>*/}
												<Image
													alt="Card background"
													fallbackSrc="/placeholder.svg"
													className="object-cover rounded-2xl"
													src={recipe.thumbnail || "/placeholder.svg"}
													width={400}
													height={180}
												/>
											{/*</AnimatedGradientBorderTW>*/}
										</CardBody>
										<CardFooter className="flex flex-col justify-start items-start gap-2 p-4">
											<h2 className="text-xl font-bold text-start">{recipe.title}</h2>
											<div className="flex flex-col items-start gap-2">
												<p className="text-gray-600 text-sm text-start">{recipe.tutorial}</p>
												<Chip
													color="primary"
													variant="solid"
													size="sm"
													className="font-semibold"
												>
													{recipe.quantitative || "No Quantitative"}
												</Chip>
											</div>
										</CardFooter>
									</Card>
								</motion.div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default RecipeList