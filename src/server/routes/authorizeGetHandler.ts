import { Request, Response } from 'express';
import { AuthCode, OAuthClient } from '../../types/auth';
import { generateSecureToken, setTokenExpiration } from '../util/helpers';
import { clients, authCodes } from '../cache/inMemoryStore';

// Authorization Endpoint
export const authorizeGetHandler = (req: Request, res: Response) => {
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
	let client = clients.get(client_id);

	// Auto-register unknown clients (handles cases where storage was cleared)
	// This is safe because we still validate all OAuth parameters
	if (!client && client_id && redirect_uri) {
		console.log('Auto-registering client due to missing registration:', client_id);

		const autoRegisteredClient: OAuthClient = {
			client_id,
			client_secret: undefined, // Public client using PKCE
			redirect_uris: [redirect_uri],
			grant_types: ['authorization_code'],
			response_types: ['code'],
			client_name: 'Auto-registered Client',
			created_at: Date.now(),
		};

		clients.set(client_id, autoRegisteredClient);
		client = autoRegisteredClient;
	}

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
		expires_at: Date.now() + setTokenExpiration(0, 7),
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
