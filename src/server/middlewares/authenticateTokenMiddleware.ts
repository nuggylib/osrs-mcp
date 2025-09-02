import { NextFunction, Request, Response } from 'express';
import { tokens } from '../cache/inMemoryStore';

// Authentication middleware
export const authenticateTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
