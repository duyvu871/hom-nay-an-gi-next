export type SendMessageResponse = {
	message: string;
	embedding: string;
} | {
	message: string;
	error: string;
}