export const initAI = async () => {
	return {
		initPrompt: [
			{
				role: 'user',
				parts: [
					{text: ''}
				],
			},
		],
	};
};