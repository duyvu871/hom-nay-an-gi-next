import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import zlib from 'zlib';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { pick } from 'stream-json/filters/Pick';
import { ignore } from 'stream-json/filters/Ignore';
import { streamValues } from 'stream-json/streamers/StreamValues';
import * as process from 'node:process';
import * as path from 'node:path';
import Success from '@util/response/successful/Success.ts';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import { ChatbotService } from '@lib/llm/base.ts';
import { GeminiChatService } from '@lib/llm/gemini.ts';

const validateBody = z.object({
	prompt: z.string({
		message: 'Prompt is required'
	}),
});

type RecommendationBody = z.infer<typeof validateBody>;

export async function POST(req: NextRequest) {
	try {
		const body = await req.json() as RecommendationBody;
		const { prompt } = validateBody.parse(body);

		const llm = new GeminiChatService(process.env.GEMINI_API_KEY);

		const embed = await llm.generateEmbedding(prompt);

		const response = new Success({
			embed,
		}).toJson;

		return NextResponse.json(response);

	} catch (error) {
		console.log('error', error);
		if (error instanceof z.ZodError) {
			const message = error.errors[0].message;
			return NextResponse.json({
				status: 400,
				message,
			});
		}

		return NextResponse.json({
			status: 500,
			message: 'Internal Server Error',
		});
	}
}