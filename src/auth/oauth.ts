import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// In-memory storage for OAuth clients and tokens
// In production, use a proper database
const clients: Map<string, OAuthClient> = new Map();
const tokens: Map<string, OAuthToken> = new Map();
const authCodes: Map<string, AuthCode> = new Map();

interface OAuthClient {
    client_id: string;
    client_secret?: string;
    redirect_uris: string[];
    grant_types: string[];
    response_types: string[];
    client_name: string;
    created_at: number;
}

interface OAuthToken {
    access_token: string;
    token_type: 'Bearer';
    expires_at: number;
    client_id: string;
    scope?: string;
}

interface AuthCode {
    code: string;
    client_id: string;
    redirect_uri: string;
    code_challenge: string;
    code_challenge_method: 'S256';
    expires_at: number;
    scope?: string;
}

// Generate secure random strings
function generateSecureToken(length: number = 32): string {
	return crypto.randomBytes(length).toString('base64url');
}

// Validate PKCE code challenge
function validatePKCE(codeVerifier: string, codeChallenge: string, method: string = 'S256'): boolean {
	if (method !== 'S256') {return false;}

	const hash = crypto.createHash('sha256').update(codeVerifier).digest();
	const challenge = hash.toString('base64url');
	return challenge === codeChallenge;
}

// Validate redirect URI
function isValidRedirectUri(uri: string): boolean {
	try {
		const url = new URL(uri);
		// Allow localhost or HTTPS URLs as per MCP spec
		return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

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

// Dynamic Client Registration (RFC 7591)
export const registerClient = (req: Request, res: Response) => {
	const {
		redirect_uris,
		grant_types = ['authorization_code'],
		response_types = ['code'],
		client_name = 'Unknown Client',
		_scope,
	} = req.body;

	// Validate redirect URIs
	if (!redirect_uris || !Array.isArray(redirect_uris) || redirect_uris.length === 0) {
		return res.status(400).json({
			error: 'invalid_redirect_uri',
			error_description: 'redirect_uris is required and must be a non-empty array',
		});
	}

	for (const uri of redirect_uris) {
		if (!isValidRedirectUri(uri)) {
			return res.status(400).json({
				error: 'invalid_redirect_uri',
				error_description: `Invalid redirect URI: ${uri}`,
			});
		}
	}

	// Generate client credentials
	const client_id = generateSecureToken(16);
	const client_secret = generateSecureToken(32);

	const client: OAuthClient = {
		client_id,
		client_secret,
		redirect_uris,
		grant_types,
		response_types,
		client_name,
		created_at: Date.now(),
	};

	clients.set(client_id, client);

	res.json({
		client_id,
		client_secret,
		client_id_issued_at: Math.floor(Date.now() / 1000),
		client_secret_expires_at: 0, // Never expires
		redirect_uris,
		grant_types,
		response_types,
		client_name,
	});
};

// Authorization Endpoint
export const authorize = (req: Request, res: Response) => {
	const {
		response_type,
		client_id,
		redirect_uri,
		scope,
		state,
		code_challenge,
		_code_challenge_method = 'S256',
	} = req.query;

	// Validate required parameters
	if (response_type !== 'code') {
		return res.status(400).json({
			error: 'unsupported_response_type',
			error_description: 'Only authorization code flow is supported',
		});
	}

	if (!client_id || typeof client_id !== 'string') {
		return res.status(400).json({
			error: 'invalid_request',
			error_description: 'client_id is required',
		});
	}

	if (!redirect_uri || typeof redirect_uri !== 'string') {
		return res.status(400).json({
			error: 'invalid_request',
			error_description: 'redirect_uri is required',
		});
	}

	if (!code_challenge || typeof code_challenge !== 'string') {
		return res.status(400).json({
			error: 'invalid_request',
			error_description: 'code_challenge is required (PKCE)',
		});
	}

	// Validate client
	const client = clients.get(client_id);
	if (!client) {
		return res.status(400).json({
			error: 'invalid_client',
			error_description: 'Unknown client',
		});
	}

	// Validate redirect URI
	if (!client.redirect_uris.includes(redirect_uri)) {
		return res.status(400).json({
			error: 'invalid_request',
			error_description: 'redirect_uri not registered for this client',
		});
	}

	// Generate authorization code
	const code = generateSecureToken(16);
	const authCode: AuthCode = {
		code,
		client_id,
		redirect_uri,
		code_challenge,
		code_challenge_method: 'S256',
		expires_at: Date.now() + (10 * 60 * 1000), // 10 minutes
		scope: typeof scope === 'string' ? scope : undefined,
	};

	authCodes.set(code, authCode);

	// In a real implementation, you would show a consent screen here
	// For simplicity, we'll auto-approve for OSRS wiki access
	const redirectUrl = new URL(redirect_uri);
	redirectUrl.searchParams.set('code', code);
	if (state && typeof state === 'string') {
		redirectUrl.searchParams.set('state', state);
	}

	res.redirect(redirectUrl.toString());
};

// Token Endpoint
export const token = (req: Request, res: Response) => {
	const {
		grant_type,
		code,
		redirect_uri,
		client_id,
		client_secret,
		code_verifier,
	} = req.body;

	if (grant_type === 'authorization_code') {
		// Authorization Code Grant
		if (!code || !redirect_uri || !client_id || !code_verifier) {
			return res.status(400).json({
				error: 'invalid_request',
				error_description: 'Missing required parameters',
			});
		}

		const authCode = authCodes.get(code);
		if (!authCode) {
			return res.status(400).json({
				error: 'invalid_grant',
				error_description: 'Invalid or expired authorization code',
			});
		}

		// Check expiration
		if (authCode.expires_at < Date.now()) {
			authCodes.delete(code);
			return res.status(400).json({
				error: 'invalid_grant',
				error_description: 'Authorization code expired',
			});
		}

		// Validate client and redirect URI
		if (authCode.client_id !== client_id || authCode.redirect_uri !== redirect_uri) {
			return res.status(400).json({
				error: 'invalid_grant',
				error_description: 'Authorization code mismatch',
			});
		}

		// Validate PKCE
		if (!validatePKCE(code_verifier, authCode.code_challenge)) {
			return res.status(400).json({
				error: 'invalid_grant',
				error_description: 'PKCE validation failed',
			});
		}

		// Generate access token
		const access_token = generateSecureToken(32);
		const tokenData: OAuthToken = {
			access_token,
			token_type: 'Bearer',
			expires_at: Date.now() + (60 * 60 * 1000), // 1 hour
			client_id,
			scope: authCode.scope,
		};

		tokens.set(access_token, tokenData);
		authCodes.delete(code); // One-time use

		return res.json({
			access_token,
			token_type: 'Bearer',
			expires_in: 3600,
			scope: authCode.scope,
		});

	} else if (grant_type === 'client_credentials') {
		// Client Credentials Grant
		if (!client_id) {
			return res.status(400).json({
				error: 'invalid_request',
				error_description: 'client_id is required',
			});
		}

		const client = clients.get(client_id);
		if (!client) {
			return res.status(401).json({
				error: 'invalid_client',
				error_description: 'Unknown client',
			});
		}

		// Validate client secret if provided
		if (client.client_secret && client_secret !== client.client_secret) {
			return res.status(401).json({
				error: 'invalid_client',
				error_description: 'Invalid client credentials',
			});
		}

		// Generate access token
		const access_token = generateSecureToken(32);
		const tokenData: OAuthToken = {
			access_token,
			token_type: 'Bearer',
			expires_at: Date.now() + (60 * 60 * 1000), // 1 hour
			client_id,
			scope: 'osrs:read',
		};

		tokens.set(access_token, tokenData);

		return res.json({
			access_token,
			token_type: 'Bearer',
			expires_in: 3600,
			scope: 'osrs:read',
		});
	}

	res.status(400).json({
		error: 'unsupported_grant_type',
		error_description: 'Only authorization_code and client_credentials grants are supported',
	});
};

// Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({
			error: 'invalid_token',
			error_description: 'Bearer token required',
		});
	}

	const token = authHeader.slice(7); // Remove 'Bearer ' prefix
	const tokenData = tokens.get(token);

	if (!tokenData) {
		return res.status(401).json({
			error: 'invalid_token',
			error_description: 'Token not found',
		});
	}

	if (tokenData.expires_at < Date.now()) {
		tokens.delete(token);
		return res.status(401).json({
			error: 'invalid_token',
			error_description: 'Token expired',
		});
	}

	// Add token info to request
	(req as any).oauth = {
		client_id: tokenData.client_id,
		scope: tokenData.scope,
	};

	next();
};