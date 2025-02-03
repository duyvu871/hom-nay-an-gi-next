export type ExternalLoginAPIResponse = {
	accessToken: {
		token: string;
		expire_access_token: number;
		token_type: string;
		refresh_token: string;
		expire_refresh_token: number;
	};
	user: {
		id: string;
		username: string;
		email: string;
		age: number;
		phone_number: string;
	};
}

export type ExternalRefreshTokenAPIResponse = {
	accessToken: {
		token: string;
		expire_access_token: number;
		token_type: string;
	};
}

export type AuthLoginSuccessResponse = {
	id: string;
	username: string;
	email: string;
	age: number;
	phone_number: string;
	avatar: string;
	role: "admin" | "user" | "membership";
}