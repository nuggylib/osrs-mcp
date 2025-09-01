import { Request, Response } from 'express';
import { OAuthToken } from '../../types/auth';
import { validatePKCE, generateSecureToken, setTokenExpiration } from '../util/helpers';
import { authCodes, tokens, clients } from '../cache/inMemoryStore';

// Token Endpoint
export const tokenPostHandler = (req: Request, res: Response) => {
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
			expires_at: setTokenExpiration(0, 7),
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
			console.error('Token exchange failed - unknown client_id:', client_id);
			console.log('Available clients:', Array.from(clients.keys()));
			return res.status(401).json({
				error: 'invalid_client',
				error_description: 'Unknown client. Client may need to re-authorize.',
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
			expires_at: setTokenExpiration(0, 7),
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
