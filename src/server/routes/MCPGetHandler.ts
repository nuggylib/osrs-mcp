import { Request, Response } from 'express';
import { transports } from '../cache/cache';

// TODO: Confirm the accuracy of this doc comment
/**
 * MCP GET Handler.
 *
 * This method works by grabbing the last event ID, if it exists, or creates
 * a new one before passing the request to the underlying MCP Server.
 */
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
	if (!transport) {
		console.error(`Transport not found for session: ${sessionId}`);
		if (!res.headersSent) {
			res.status(400).json({
				jsonrpc: '2.0',
				error: {
					code: -32000,
					message: 'Session not found or expired',
				},
				id: null,
			});
		}
		return;
	}
	await transport.handleRequest(req, res);
}
