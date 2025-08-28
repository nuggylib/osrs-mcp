import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { transports } from '../cache';

// TODO: Confirm the accuracy of this doc comment
/**
 * MCP Server POST handler.
 *
 * This method works by opening a new session-based MCP Server connection and making
 * a request. The connection only remains open for the duration of the request, but the
 * session ID persists between requests (since it's intended to be cached).
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

	// TODO: Eventually support OAuth
	// if (useOAuth && req.auth) {
	// 	console.log('Authenticated user:', req.auth);
	// }

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
