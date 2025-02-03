const models = [
	{
		default: true,
		name: 'Base model',
		description: 'model1 description',
		code: '001',
	},
];
const modelsEnum = {
	'001': 'Base model',
}

const validateModel = (model: string) => {
	return Boolean(modelsEnum[model as keyof typeof modelsEnum]);
}

export { models, modelsEnum, validateModel };