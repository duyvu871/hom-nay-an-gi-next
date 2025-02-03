import { Recipe } from '@schema/recipe-schema.ts';

export const sampleRecipes: Recipe[] = [
	{
		link: "https://example.com/pasta-carbonara",
		title: "Pasta Carbonara",
		thumbnail: "/placeholder.svg?height=400&width=600&text=Pasta+Carbonara",
		tutorial: "A classic Italian pasta dish with a creamy egg sauce.",
		quantitative: "4 servings",
		ingredient_title: "Ingredients",
		ingredient_markdown: "- Spaghetti\n- Eggs\n- Pancetta\n- Parmesan cheese\n- Black pepper",
		step_markdown: "1. Cook pasta\n2. Fry pancetta\n3. Mix eggs and cheese\n4. Combine all ingredients",
		tutorial_step: [
			{
				index: 1,
				title: "Prepare the Ingredients",
				content: "Gather all the ingredients. Bring a large pot of salted water to boil for the pasta.",
				box_gallery: [
					"/placeholder.svg?height=200&width=200&text=Ingredients",
					"/placeholder.svg?height=200&width=200&text=Boiling+Water",
				],
			},
			{
				index: 2,
				title: "Cook the Pasta",
				content: "Cook the spaghetti in the boiling water according to package instructions until al dente.",
				box_gallery: ["/placeholder.svg?height=200&width=200&text=Cooking+Pasta"],
			},
			{
				index: 3,
				title: "Prepare the Sauce",
				content: "While the pasta is cooking, whisk together eggs, grated Parmesan cheese, and black pepper in a bowl.",
				box_gallery: [
					"/placeholder.svg?height=200&width=200&text=Whisking+Eggs",
					"/placeholder.svg?height=200&width=200&text=Grated+Cheese",
				],
			},
			{
				index: 4,
				title: "Cook the Pancetta",
				content: "In a large skillet, cook the diced pancetta over medium heat until crispy.",
				box_gallery: ["/placeholder.svg?height=200&width=200&text=Cooking+Pancetta"],
			},
			{
				index: 5,
				title: "Combine and Serve",
				content:
					"Drain the pasta and add it to the skillet with the pancetta. Remove from heat and quickly stir in the egg mixture, tossing to coat the pasta and create a creamy sauce.",
				box_gallery: [
					"/placeholder.svg?height=200&width=200&text=Combining+Ingredients",
					"/placeholder.svg?height=200&width=200&text=Final+Dish",
				],
			},
		],
		ingredients: [
			{ name: "Spaghetti", quantitative: "400", unit: "g" },
			{ name: "Eggs", quantitative: "4", unit: "large" },
			{ name: "Pancetta", quantitative: "150", unit: "g" },
			{ name: "Parmesan cheese", quantitative: "100", unit: "g" },
			{ name: "Black pepper", quantitative: "1", unit: "tsp" },
		],
	},
	{
		link: "https://example.com/chicken-stir-fry",
		title: "Chicken Stir-Fry",
		thumbnail: "/placeholder.svg?height=400&width=600&text=Chicken+Stir-Fry",
		tutorial: "A quick and easy Asian-inspired dish with vegetables and chicken.",
		quantitative: "3 servings",
		ingredient_title: "Ingredients",
		ingredient_markdown: "- Chicken breast\n- Mixed vegetables\n- Soy sauce\n- Garlic\n- Ginger",
		step_markdown: "1. Prepare ingredients\n2. Cook chicken\n3. Stir-fry vegetables\n4. Combine and season",
		tutorial_step: [
			{
				index: 1,
				title: "Prepare the Ingredients",
				content: "Cut the chicken into bite-sized pieces. Chop the vegetables and mince the garlic and ginger.",
				box_gallery: [
					"/placeholder.svg?height=200&width=200&text=Chopped+Chicken",
					"/placeholder.svg?height=200&width=200&text=Chopped+Vegetables",
				],
			},
			{
				index: 2,
				title: "Cook the Chicken",
				content: "Heat oil in a wok or large skillet. Add the chicken and cook until golden brown.",
				box_gallery: ["/placeholder.svg?height=200&width=200&text=Cooking+Chicken"],
			},
			{
				index: 3,
				title: "Stir-Fry Vegetables",
				content: "Remove the chicken and set aside. In the same pan, stir-fry the vegetables with garlic and ginger.",
				box_gallery: ["/placeholder.svg?height=200&width=200&text=Stir-Frying+Vegetables"],
			},
			{
				index: 4,
				title: "Combine and Season",
				content:
					"Return the chicken to the pan. Add soy sauce and stir to combine. Cook for a few more minutes until everything is heated through.",
				box_gallery: [
					"/placeholder.svg?height=200&width=200&text=Combining+Ingredients",
					"/placeholder.svg?height=200&width=200&text=Final+Dish",
				],
			},
		],
		ingredients: [
			{ name: "Chicken breast", quantitative: "500", unit: "g" },
			{ name: "Mixed vegetables", quantitative: "400", unit: "g" },
			{ name: "Soy sauce", quantitative: "3", unit: "tbsp" },
			{ name: "Garlic", quantitative: "3", unit: "cloves" },
			{ name: "Ginger", quantitative: "1", unit: "tbsp" },
		],
	},
	{
		link: "https://example.com/chocolate-chip-cookies",
		title: "Chocolate Chip Cookies",
		thumbnail: "/placeholder.svg?height=400&width=600&text=Chocolate+Chip+Cookies",
		tutorial: "Classic homemade chocolate chip cookies that are soft and chewy.",
		quantitative: "24 cookies",
		ingredient_title: "Ingredients",
		ingredient_markdown:
			"- Flour\n- Butter\n- Brown sugar\n- White sugar\n- Eggs\n- Vanilla extract\n- Chocolate chips",
		step_markdown:
			"1. Cream butter and sugars\n2. Add eggs and vanilla\n3. Mix dry ingredients\n4. Add chocolate chips\n5. Bake",
		tutorial_step: [
			{
				index: 1,
				title: "Cream Butter and Sugars",
				content: "In a large bowl, cream together the softened butter, brown sugar, and white sugar until smooth.",
				box_gallery: [
					"/placeholder.svg?height=200&width=200&text=Creaming+Butter",
					"/placeholder.svg?height=200&width=200&text=Adding+Sugars",
				],
			},
			{
				index: 2,
				title: "Add Eggs and Vanilla",
				content: "Beat in the eggs one at a time, then stir in the vanilla extract.",
				box_gallery: ["/placeholder.svg?height=200&width=200&text=Adding+Eggs"],
			},
			{
				index: 3,
				title: "Mix Dry Ingredients",
				content:
					"In a separate bowl, whisk together the flour, baking soda, and salt. Gradually mix into the wet ingredients.",
				box_gallery: ["/placeholder.svg?height=200&width=200&text=Mixing+Dry+Ingredients"],
			},
			{
				index: 4,
				title: "Add Chocolate Chips",
				content: "Fold in the chocolate chips.",
				box_gallery: ["/placeholder.svg?height=200&width=200&text=Adding+Chocolate+Chips"],
			},
			{
				index: 5,
				title: "Bake",
				content:
					"Drop spoonfuls of dough onto ungreased baking sheets. Bake at 350°F (175°C) for 8 to 10 minutes or until edges are nicely browned.",
				box_gallery: [
					"/placeholder.svg?height=200&width=200&text=Baking+Cookies",
					"/placeholder.svg?height=200&width=200&text=Final+Cookies",
				],
			},
		],
		ingredients: [
			{ name: "All-purpose flour", quantitative: "280", unit: "g" },
			{ name: "Butter", quantitative: "230", unit: "g" },
			{ name: "Brown sugar", quantitative: "200", unit: "g" },
			{ name: "White sugar", quantitative: "100", unit: "g" },
			{ name: "Eggs", quantitative: "2", unit: "large" },
			{ name: "Vanilla extract", quantitative: "2", unit: "tsp" },
			{ name: "Chocolate chips", quantitative: "340", unit: "g" },
		],
	},
]

