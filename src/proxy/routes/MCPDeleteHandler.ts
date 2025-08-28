import { Request, Response } from 'express';
import { transports } from '../cache';

export const mcpDeleteHandler = async (req: Request, res: Response) => {
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
	console.log(`Received session termination request for session ${sessionId}`);
	try {
		const transport = transports[sessionId];
		await transport.handleRequest(req, res);
	}
	catch (error) {
		console.error('Error handling session termination:', error);
		if (!res.headersSent) {
			res.status(500).send('Error processing session termination');
		}
	}
};
