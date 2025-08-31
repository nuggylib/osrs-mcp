export interface OAuthClient {
	client_id: string;
	client_secret?: string;
	redirect_uris: string[];
	grant_types: string[];
	response_types: string[];
	client_name: string;
	created_at: number;
}

export interface OAuthToken {
	access_token: string;
	token_type: 'Bearer';
	expires_at: number;
	client_id: string;
	scope?: string;
}

export interface AuthCode {
	code: string;
	client_id: string;
	redirect_uri: string;
	code_challenge: string;
	code_challenge_method: 'S256';
	expires_at: number;
	scope?: string;
}
