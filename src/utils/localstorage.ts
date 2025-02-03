
export const getLocalStorage = <T>(key: string): T | null => {
	try {
		const value = localStorage.getItem(key);
		if (value) {
			return JSON.parse(value);
		}
		return null;
	} catch (error) {
		console.error('Error getting data from local storage', error);
		return null;
	}
}

export const setLocalStorage = (key: string, value: any) => {
	try {
		const valueString = JSON.stringify(value);
		localStorage.setItem(key, valueString);
	} catch (error) {
		console.error('Error setting data to local storage', error);
	}
}

export const removeLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error('Error removing data from local storage', error);
	}
}