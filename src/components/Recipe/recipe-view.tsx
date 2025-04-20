"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Tabs, Tab } from "@heroui/tabs";
import { Recipe } from "@schema/recipe-schema.ts";
import { ImageWrapper } from '@provider/image-provider.tsx';

const RecipeViewer: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
	return (
		<Card className="max-w-4xl mx-auto p-0 md:p-10">
			<CardHeader>
				<h2 className="text-2xl font-bold">{recipe.title}</h2>
			</CardHeader>
			<CardBody>
				{recipe.thumbnail && (
					<div className="relative w-full h-64 md:h-80 mb-4">
						{/* <ImageWrapper key={recipe.thumbnail || "thumbnail"} src={recipe.thumbnail}> */}
							<Image
								src={recipe.thumbnail || "/placeholder.svg"}
								alt={recipe.title}
								layout="fill"
								objectFit="contain"
								className="rounded-lg bg-zinc-100"
							/>
						{/* </ImageWrapper> */}
					</div>
				)}
				<p className="text-gray-600 text-center mb-4">{recipe.tutorial}</p>
				<h3 className="text-xl font-semibold my-4">
					Thành phần cần chuẩn bị :
				</h3>
				<div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-md">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nguyên liệu
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số lượng
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recipe.ingredients.map((ingredient, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ingredient.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {ingredient.quantitative}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
				<h3 className="text-xl font-semibold my-4">
					Cách thực hiện :
				</h3>
				{recipe.tutorial_step.map((step, index) => (
					<div key={index} className="mb-6 last:mb-0">
						<h4 className="text-lg font-semibold mb-2">
							{index + 1}. {step.title}
						</h4>
						<p className="mb-4">{step.content}</p>
						{step.box_gallery.length > 0 && (
							<div className="grid grid-cols-2 gap-2">
								{step.box_gallery.map((img, imgIndex) => (
									<div key={imgIndex} className="relative h-32 md:h-64">
										<Image
											src={img || "/placeholder.svg"}
											alt={`Step ${index + 1} image ${imgIndex + 1}`}
											layout="fill"
											objectFit="cover"
											className="rounded"
										/>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</CardBody>
		</Card>
	);
};

export default RecipeViewer;
