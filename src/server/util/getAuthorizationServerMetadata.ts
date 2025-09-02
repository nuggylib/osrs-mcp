// OAuth Server Metadata (RFC 8414)
export const getAuthorizationServerMetadata = () => {
	const baseUrl = process.env.BASE_URL || 'https://localhost:3000';

	return {
		issuer: baseUrl,
		authorization_endpoint: `${baseUrl}/authorize`,
		token_endpoint: `${baseUrl}/token`,
		registration_endpoint: `${baseUrl}/register`,
		grant_types_supported: ['authorization_code', 'client_credentials'],
		response_types_supported: ['code'],
		token_endpoint_auth_methods_supported: ['client_secret_post', 'none'],
		code_challenge_methods_supported: ['S256'],
		scopes_supported: ['osrs:read'],
	};
};
