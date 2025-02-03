declare global {
	namespace NodeJS {
		interface ProcessEnv {
			GEMINI_API_KEY: string;
			NEXT_PUBLIC_API_HOST: string;
			SUPABASE_URL: string;
			SUPABASE_KEY: string;
			DATABASE_URL: string;
			DIRECT_URL: string;
			POSTGRES_HOST: string;
			POSTGRES_PORT: string;
			POSTGRES_USER: string;
			POSTGRES_PASSWORD: string;
			POSTGRES_DB: string;
		}
	}
}

export {};