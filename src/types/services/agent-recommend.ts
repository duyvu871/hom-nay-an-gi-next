export type SendMessageResponse = {
	message: string;
	embedding: {
		ingredient: string;
		name: string;
	};
} | {
	message: string;
	error: string;
}