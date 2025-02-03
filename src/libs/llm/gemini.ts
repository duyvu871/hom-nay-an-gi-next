import type {
	Content,
	GenerationConfig,
	GenerativeModel,
	Part,
	SafetySetting} from '@google/generative-ai';
import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory
} from '@google/generative-ai';
import { initAI } from './init';
import { ChatbotService } from '@lib/llm/base';

export type MimeTypes =
	'image/png'
	| 'image/png-sequence'
	| 'image/webp'
	| 'image/webp-sequence'
	| 'image/gif'
	| 'image/gif-sequence'
	| 'image/svg+xml'
	| 'image/svg+xml-sequence'
	| 'image/bmp'
	| 'image/bmp-sequence'
	| 'image/tiff'
	| 'image/tiff-sequence'
	| 'image/x-icon'
	| 'image/x-icon-sequence'
	| 'image/vnd.microsoft.icon'
	| 'image/vnd.microsoft.icon-sequence'
	| 'image/vnd.wap.wbmp'
	| 'image/vnd.wap.wbmp-sequence'
	| 'image/heic'
	| 'image/heif'
	| 'image/heif-sequence'
	| 'image/heic-sequence'
	| 'image/hej2'
	| 'image/hej2-sequence'
	| 'image/avif'
	| 'image/avif-sequence'
	| 'image/jxl'
	| 'image/jxl-sequence'
	| 'image/jpm'
	| 'image/jpm-sequence'
	| 'image/jpx'
	| 'image/jpx-sequence'
	| 'image/jpg'
	| 'image/jpg-sequence'
	| 'image/jpeg'
	| 'image/jpeg-sequence';


export class GeminiChatService extends ChatbotService {
	private genAI: GoogleGenerativeAI;
	private model: GenerativeModel;
	private embedAI: GenerativeModel;

	protected errorResponse = 'Xin lỗi, agent gặp sự cố trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau.';
	protected generationConfig: GenerationConfig;
	protected safetySettings: SafetySetting[];

	constructor(apiKey: string) {
		super();
		this.genAI = new GoogleGenerativeAI(apiKey);
		this.model = this.genAI.getGenerativeModel({
			model: "gemini-2.0-flash-exp",
			systemInstruction: "### Thông tin\n\nBạn là một trợ lý ảo với kinh nghiệm như một đầu bếp có 10 năm kinh nghiệm trong một nhà hàng lớn và có kinh nghiệm xử lý các món ăn bình dân, cũng như sở hữu một kinh nghiệm đồ sộ về tâm lý học giúp đưa ra gợi ý món ăn một cách chính xác\n\n### Nhiệm vụ chung của bạn:\n\ntrả về các từ khóa về nguyên liệu, tên món ăn nhằm mục đích tạo embeding\n\n### Yêu cầu:\n\n#### Trong phản hồi của bạn, sẽ có 2 phần:\n\n\n\n- Phần 1: Là câu trả lời cho yêu cầu của người dùng, ví dụ:\n\n\n\n- Phần 2: là yêu cầu về các từ khóa về nguyên liệu, tên món ăn nhằm mục đích tạo embeding\n\n\n\n#### Trả lời dưới dạng:\n\n```\n\n[ai]Đây là nội dung phần 1[/ai][embeding]Đây là nội dung phần 2[/embeding]\n\n```\n\n\n\n- Viết liền trên 1 dòng, bạn chỉ được phép trả lời dưới dạng trên\n\n- Các từ khóa bọc trong ``[embeding]`` và ``[/embeding]``\n\n##### Người dùng hỏi\n\n```\n\nTôi muốn ăn các món tốt cho sức khỏe với thời tiết oi nóng\n\n```\n\n#### Bạn cần trả lời\n\n```\n\n[aiDưới đây là một vài gợi ý món ăn tốt cho sức khỏe, phù hợp với thời tiết oi nóng[/ai][embeding]Salad rau củ quả,salad,rau củ,dưa chuột,cà chua,xà lách,rau mầm,dầu ô liu,giấm balsamic,ức gà,cá ngừ,đậu hũ,tốt cho sức khỏe,mát,dễ tiêu,Gỏi cuốn tôm thịt,gỏi cuốn,tôm thịt,bún tươi,rau sống,bánh tráng,nước mắm chua ngọt,thanh mát,dễ tiêu,Bún chả cá,bún chả cá,chả cá,bún,rau sống,nước chấm mắm me,chua ngọt,giải nhiệt,Canh chua cá,canh chua,cá,cà chua,dứa,me,rau thơm,chua cay,kích thích tiêu hoá,Cá hấp gừng hành,cá hấp,gừng,hành,thanh đạm,dễ tiêu[/embeding]\n\n```\n\n\n\n##### Người dùng hỏi\n\n```aiignore\n\nthời tiết oi nóng, khó chịu trong người, gà\n\n```\n\n#### Bạn cần trả lời\n\n```\n\n[ai]Dưới đây là danh sách các món phù hợp với tiết trời oi nóng, khó chịu trong người có nguyên liệu là gà[/ai][embeding]Gỏi gà xé phay,gỏi gà,gà xé phay,món khai vị,mát,chua ngọt,dễ làm,nhanh,tiết kiệm thời gian,thịt gà,hành tây,cà rốt,rau răm,đậu phộng,chanh,ớt,tỏi,nước mắm,đường,Cháo gà hạt sen,cháo gà,hạt sen,bổ dưỡng,mát,dễ tiêu,khó chịu,oi nóng,gạo,thịt gà,hạt sen,gừng,hành lá,tiêu,muối,Gà luộc chấm muối chanh,gà luộc,muối chanh,đơn giản,nhanh,dễ tiêu,mát,tiết kiệm thời gian,thịt gà,muối,chanh,ớt,tiêu,lá chanh,Nộm gà bắp cải,nộm gà,bắp cải,giòn,mát,chua ngọt,dễ làm,thịt gà,bắp cải,cà rốt,hành tây,rau thơm,đậu phộng,chanh,ớt,nước mắm,đường,Miến gà,miến gà,thanh đạm,dễ tiêu,mát mẻ,nhẹ nhàng,miến,thịt gà,nấm hương,mộc nhĩ,hành lá,rau thơm,gia vị[/embeding]\n\n```\n\n  \n  \n\n",
		});

		this.embedAI = this.genAI.getGenerativeModel({
			model: "text-embedding-004"
		});

		this.generationConfig = {
			temperature: 1,
			topP: 0.95,
			topK: 39,
			maxOutputTokens: 8192,
			responseMimeType: 'text/plain',
		};
		this.safetySettings = [
			{
				category: HarmCategory.HARM_CATEGORY_HARASSMENT,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
			{
				category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
			{
				category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
			{
				category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
				threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
			},
		];
	}

	public async generateEmbedding(text: string) {
		const response = await this.embedAI.embedContent(text);
		// console.log("embedded", response.embedding.values);
		return response.embedding.values;
	}


	public async sendMessage(
		message: {
			textContent: string;
			mediaContent: string[]; // url for media content
		},
		history: Content[],
		passInitPrompt?: boolean,
	) {
		try {
			const messageContent: string | (string | Part)[] = [
				{
					text: message.textContent,
				},
			];

			if (message.mediaContent.length > 0) {
				const contentFetch = message.mediaContent.map((item) => this.fetchToBase64WithMimeType(item));
				const content = await Promise.all(contentFetch);
				const filteredContent = content.filter((item) => item?.contentType && item?.base64Data) as NonNullable<{
					base64Data: string;
					contentType: MimeTypes
				}[]>;
				const mediaContent = filteredContent.map((item) =>
					this.fileToGenerativePath(item.base64Data, item.contentType));
				messageContent.push(...mediaContent);
			}
			// console.log(messageContent);
			const chatSession = this.model.startChat({
				generationConfig: this.generationConfig,
				safetySettings: this.safetySettings,
				history: passInitPrompt ? [...history] : history,
			});

			const result = await chatSession.sendMessage(messageContent);
			return {
				answer: result.response.text(),
			};
		} catch (error: any) {
			console.log('Error sending message:', error);
			return {
				answer: this.errorResponse,
				error: error.message,
			};
		}
	}

	/**
	 * Generate a message from a prompt
	 * @param content base64 encoded asset
	 * @param mimeType mime type of the asset
	 * @returns
	 */
	public fileToGenerativePath(content: string, mimeType: MimeTypes): {
		inlineData: {
			data: string;
			mimeType: MimeTypes;
		};
	} {
		return {
			inlineData: {
				data: content,
				mimeType,
			},
		};
	}

	public async fetchToBase64WithMimeType(url: string) {
		try {
			// validate url
			const urlObj = new URL(url);
			if (!urlObj.protocol.startsWith('http')) {
				return {
					contentType: null,
					base64Data: null,
				};
			}

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const contentType = response.headers.get('Content-Type');
			const blob = await response.blob();
			const buffer = await blob.arrayBuffer();
			const base64String = Buffer.from(buffer).toString('base64');

			return {
				contentType,
				base64Data: base64String,
			};
		} catch (error) {
			console.error('Error fetching or converting to base64:', error);
			return null;
		}
	}
}
