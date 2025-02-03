import { z } from 'zod';

export function generateTimeBasedId(length: number = 15) {
	const timestamp = Date.now().toString(36);
	const randomPartLength = length - timestamp.length;

	if (randomPartLength <= 0) {
		return timestamp.slice(0, length);
	}

	const randomArray = new Uint8Array(randomPartLength);
	crypto.getRandomValues(randomArray);

	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const randomPart = Array.from(randomArray, (byte) => chars[byte % chars.length]).join('');

	return timestamp + randomPart;
}

export const checkUUIDv4 = (uuid: string): boolean => {
	try {
		const uuidSchema = z.string().uuid();
		uuidSchema.parse(uuid);
		return true;
	} catch (error) {
		return false;
	}
}