import { Request, Response } from 'express';
import { transports } from '../cache';

export const mcpGetHandler = async (req: Request, res: Response) => {
	const sessionId = req.headers['mcp-session-id'];
	if (!sessionId || typeof sessionId !== 'string') {
		console.error('Invalid or missing sessionId');
		if (!res.headersSent) {
			res.status(400).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: 'sessionId must be provided',
				},
				id: null,
			});
		}
		return
	}
	// TODO: Eventually support OAuth
	// if (useOAuth && req.auth) {
	// 	console.log('Authenticated SSE connection from user:', req.auth);
	// }
	// Check for Last-Event-ID header for resumability
	const lastEventId = req.headers['last-event-id'];
	if (lastEventId) {
		console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`);
	}
	else {
		console.log(`Establishing new SSE stream for session ${sessionId}`);
	}
	const transport = transports[sessionId];
	await transport.handleRequest(req, res);
}
