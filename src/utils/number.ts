import {
	InvalidFormatError,
	InvalidNumberError,
	NotEnoughUnitError,
	ReadingConfig,
	doReadNumber,
} from 'read-vietnamese-number';

// Config reading options
const config = new ReadingConfig();
config.unit = ['đồng'];

export const readNumber = (number: string): string => {
	try {
		return doReadNumber(config, number);
	} catch (error: any) {
		if (error instanceof InvalidNumberError) {
			console.error('Invalid number:', error.message);
			return 'Invalid number';
		} else if (error instanceof InvalidFormatError) {
			console.error('Invalid format:', error.message);
			return 'Invalid format';
		} else if (error instanceof NotEnoughUnitError) {
			console.error('Not enough unit:', error.message);
			return 'Not enough unit';
		} else {
			console.error('Unknown error:', error.message);
		}
		return '';
	}
}

export function separateArray<T>(item: T[], batchSize: number): T[][] {
	const result: T[][] = [];
	const index = 0;
	const arrayLength = item.length;
	const excess = item.length % batchSize;
	const fullFits = Math.floor(arrayLength / batchSize);

	for (let i = 0; i < fullFits; i++) {
		result.push(item.slice(i * batchSize, (i + 1) * batchSize));
	}

	if (excess > 0) {
		result.push(item.slice(fullFits * batchSize));
	}

	return result;
}

export function separateArrayByTotalBatch<T>(items: T[], totalBatches: number): T[][] {
	const arrayLength = items.length;
	const baseBatchSize = Math.floor(arrayLength / totalBatches);
	const remainder = arrayLength % totalBatches;
	const result: T[][] = [];

	let startIndex = 0;
	for (let i = 0; i < totalBatches; i++) {
		const batchSize = baseBatchSize + (i < remainder ? 1 : 0); // Add 1 to the batch size for the first 'remainder' batches
		const endIndex = startIndex + batchSize;
		result.push(items.slice(startIndex, endIndex));
		startIndex = endIndex;
	}

	return result;
}

// (() => {
// 	const number = 'một triệu đồng';
// 	console.log(readNumber(number)); // Output: 1,000,000 đồng
//
// 	const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// 	const totalBatches = 3;
// 	console.log(separateArrayByTotalBatch(items, totalBatches)); // Output: [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10]]
// })()



