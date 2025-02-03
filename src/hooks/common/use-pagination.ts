
import { useMemo } from 'react';

// Define a type for the return value of the usePagination hook
type PaginationRange = (number | string)[]

// Enum for the DOTS representation in pagination
export enum PaginationElementType {
	DOTS = 'DOTS',
}

// Helper function to create an array representing a range of numbers
const range = (start: number, end: number): number[] => {
	// Optimize by calculating the array length only once
	const length = end - start + 1;

	return Array.from({ length }, (_, index) => index + start);
};

interface UsePaginationProps {
	totalCount: number;
	pageSize: number;
	siblingCount?: number;
	currentPage: number;
}

export const usePagination = ({
																totalCount,
																pageSize,
																siblingCount = 1, // Default to 1 sibling on each side
																currentPage,
															}: UsePaginationProps): PaginationRange => {
	// Memoize the pagination logic to prevent unnecessary recalculations
	const paginationRange = useMemo<PaginationRange>(() => {
		const totalPageCount = Math.ceil(totalCount / pageSize);

		// Simplified calculation for the total desired page numbers in pagination
		const totalPageNumbers = siblingCount + 5; // siblingCount + firstPage + lastPage + currentPage + 2*DOTS

		// Case 1: Show all page numbers if they fit
		if (totalPageNumbers >= totalPageCount) {
			return range(1, totalPageCount);
		}

		// Calculate left and right sibling indices, ensuring they stay within valid page bounds
		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

		// Determine if we need to show the left or right DOTS (...)
		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

		const firstPageIndex = 1;
		const lastPageIndex = totalPageCount;

		// Case 2: Show right dots, but not left dots
		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblingCount;
			const leftRange = range(1, leftItemCount);

			// Combine the left range, DOTS, and the last page
			return [...leftRange, PaginationElementType.DOTS, lastPageIndex];
		}

		// Case 3: Show left dots, but not right dots
		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = 3 + 2 * siblingCount;
			const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);

			// Combine the first page, DOTS, and the right range
			return [firstPageIndex, PaginationElementType.DOTS, ...rightRange];
		}

		// Case 4: Show both left and right dots
		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = range(leftSiblingIndex, rightSiblingIndex);
			return [firstPageIndex, PaginationElementType.DOTS, ...middleRange, PaginationElementType.DOTS, lastPageIndex];
		}

		// Default to an empty array if no case is met
		// In reality you should never reach this branch
		return [];
	}, [totalCount, pageSize, siblingCount, currentPage]);

	return paginationRange;
};
