import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

// TODO: Probably need to move this to Redis or some other caching mechanism (rather than in-memory).
// Map to store transports by session ID
const transports = {} as {
	[key: string]: StreamableHTTPServerTransport
}

/**
 * MCP Server POST handler.
 *
 * This implementation follows the `@modelcontextprotocol/sdk` example, `simpleStreamableHttp.js`. This
 * file can be located in the package itself within `node_modules`.
 */
export const mcpPostHandler = async (req: Request, res: Response) => {
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

	console.log(`Received MCP request for session: ${sessionId}`);

	try {
		let transport: StreamableHTTPServerTransport;
		if (sessionId && transports[sessionId]) {
			// Reuse existing transport
			transport = transports[sessionId];
		}
		else if (!sessionId && isInitializeRequest(req.body)) {
			// New initialization request
			const eventStore = new InMemoryEventStore();
			transport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => randomUUID(),
				eventStore, // Enable resumability
				onsessioninitialized: (sessionId: string) => {
					// Store the transport by session ID when session is initialized
					// This avoids race conditions where requests might come in before the session is stored
					console.log(`Session initialized with ID: ${sessionId}`);
					transports[sessionId] = transport;
				},
			});
			// Set up onclose handler to clean up transport when closed
			transport.onclose = () => {
				const sid = transport.sessionId;
				if (sid && transports[sid]) {
					console.log(`Transport closed for session ${sid}, removing from transports map`);
					delete transports[sid];
				}
			};
			// TODO: CONNECT TO MCP SERVER HERE!!!!
			await transport.handleRequest(req, res, req.body);
			return; // Already handled
		}
		else {
			// Invalid request - no session ID or not initialization request
			res.status(400).json({
				jsonrpc: '2.0',
				error: {
					code: -32000,
					message: 'Bad Request: No valid session ID provided',
				},
				id: null,
			});
			return;
		}
		// Handle the request with existing transport - no need to reconnect
		// The existing transport is already connected to the server
		await transport.handleRequest(req, res, req.body);
	}
	catch (error) {
		console.error('Error handling MCP request:', error);
		if (!res.headersSent) {
			res.status(500).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: 'Internal server error',
				},
				id: null,
			});
		}
	}
};
