export type ParseResult =
	| { error: string }
	| {
	ai: string;
	embedding: { ingredient: string; name: string }
};

export function parseContent(input: string): ParseResult {
	// Check the number of [ai] and [/ai] tags
	const aiOpenCount = (input.match(/\[ai\]/g) || []).length;
	const aiCloseCount = (input.match(/\[\/ai\]/g) || []).length;
	if (aiOpenCount !== 1 || aiCloseCount !== 1) {
		return { error: "Missing [ai] tag or incorrect number of tags" };
	}

	// Check the number of [embeding] and [/embeding] tags
	const embeddingOpenCount = (input.match(/\[embeding\]/g) || []).length;
	const embeddingCloseCount = (input.match(/\[\/embeding\]/g) || []).length;
	if (embeddingOpenCount !== 1 || embeddingCloseCount !== 1) {
		return { error: "Missing [embeding] tag or incorrect number of tags" };
	}

	// Extract content from the [ai] tag
	const aiMatch = input.match(/\[ai\](.*?)\[\/ai\]/s);
	if (!aiMatch || aiMatch[1].trim() === '') {
		return { error: "Invalid or empty [ai] content" };
	}

	// Extract content from the [embeding] tag
	const embeddingMatch = input.match(/\[embeding\](.*?)\[\/embeding\]/s);
	if (!embeddingMatch || embeddingMatch[1].trim() === '') {
		return { error: "Invalid or empty [embeding] content" };
	}

	// Parse inner tags inside the [embeding] content
	const embeddingContent = embeddingMatch[1].trim();
	const ingredientMatch = embeddingContent.match(/\[ingredient\](.*?)\[\/ingredient\]/s);
	const nameMatch = embeddingContent.match(/\[name\](.*?)\[\/name\]/s);

	if (!ingredientMatch || ingredientMatch[1].trim() === '') {
		return { error: "Invalid or empty [ingredient] content inside [embeding]" };
	}
	if (!nameMatch || nameMatch[1].trim() === '') {
		return { error: "Invalid or empty [name] content inside [embeding]" };
	}

	return {
		ai: aiMatch[1].trim(),
		embedding: {
			ingredient: ingredientMatch[1].trim(),
			name: nameMatch[1].trim()
		}
	};
}
