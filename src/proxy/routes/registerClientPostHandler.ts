import { Request, Response } from 'express';
import { isValidRedirectUri, generateSecureToken } from '../util/helpers';
import { OAuthClient } from '../../types/auth';
import { clients } from '../cache/inMemoryStore';

// Dynamic Client Registration (RFC 7591)
export const registerClientPostHandler = (req: Request, res: Response) => {
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
