export const parseJson = <Parsed extends any>(jsonString: string): Parsed | null => {
		try {
				return JSON.parse(jsonString);
		} catch (error) {
				// console.error(error);
				return null;
		}
}