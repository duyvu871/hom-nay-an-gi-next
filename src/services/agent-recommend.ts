import type {ChatbotService as ChatbotServiceBase} from '@lib/llm/base';
import { GeminiChatService as Chatbot } from '@lib/llm/gemini';

import type { Content } from '@google/generative-ai';
import { initAI } from '@lib/llm/init';
import * as process from 'node:process';
import type { modelsEnum } from '@lib/llm/models-definition';
import { SendMessageResponse } from '@type/services/agent-recommend.ts';
import { parseContent } from '@util/parse.ts';

export class AgentRecommendService {
	private chatbot!: ChatbotServiceBase;
	private readonly model!: keyof typeof modelsEnum;

	constructor(model?: keyof typeof modelsEnum) {
		this.model = model || '001';
	}

	private async loadDB() {
		this.initChatbot();
	}

	private initChatbot() {
		switch (this.model) {
			case '001':
				this.chatbot = new Chatbot(process.env.GEMINI_API_KEY);
				break;
			default:
				this.chatbot = new Chatbot(process.env.GEMINI_API_KEY);
				break;
		}
	}

	// send message to the chatbot and return the response
	public async sendMessage(message: {
		textContent: string,
		mediaContent: string[],
	}): Promise<SendMessageResponse> {
		await this.loadDB();

		// send message to the chatbot
		const response = await this.chatbot.sendMessage({...message, textContent: message.textContent}, [], true);
		// return error if there is an error
		if (response.error) {
			return {
				message: response.answer,
				error: response.error,
			}
		}
		// parse the response
		const parsedResponse = parseContent(response.answer);
		// return the response
		if ('error' in parsedResponse) {
			return {
				message: parsedResponse.error,
				error: parsedResponse.error,
			};
		}

		return {
			message: parsedResponse.ai,
			embedding: parsedResponse.embedding,
		};
	}
}