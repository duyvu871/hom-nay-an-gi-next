import { z } from "zod";

export const phoneRegex = new RegExp(
	/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const dateString =  z.string().refine(
	dateString => {
		const date = new Date(dateString);
		return date instanceof Date && !isNaN(date.getTime());
	}
).innerType();