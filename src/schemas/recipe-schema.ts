export type Recipe = {
	link: string;
	title: string;
	thumbnail?: string;
	tutorial: string;
	quantitative: string;
	ingredient_title: string;
	ingredient_markdown: string;
	step_markdown: string;
	tutorial_step: {
		index: number;
		title: string;
		content: string;
		box_gallery: string[];
	}[];
	ingredients: {
		name: string;
		quantitative: string;
		unit: string;
	}[];
}