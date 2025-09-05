import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { transports } from '../cache/cache';
import { server } from '../../utils/mcpServer';

// TODO: Confirm the accuracy of this doc comment
/**
 * MCP Server POST handler.
 *
 * This method works by opening a new session-based MCP Server connection and making
 * a request. The connection only remains open for the duration of the request, but the
 * session ID persists between requests (since it's intended to be cached).
 */
export const mcpPostHandler = async (req: Request, res: Response) => {
	const sessionId = req.headers['mcp-session-id'] as string | undefined;

	// TODO: Eventually support OAuth
	// if (useOAuth && req.auth) {
	// 	console.log('Authenticated user:', req.auth);
	// }

	if (sessionId) {
		console.log(`Received MCP request for session: ${sessionId}`);
	} else {
		console.log('Received MCP initialization request');
	}

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
			await server.connect(transport);
			await transport.handleRequest(req, res, req.body);
			return; // Already handled
		}
		else if (sessionId && !transports[sessionId]) {
			// Session ID provided but not found
			console.error(`Session ID ${sessionId} not found in transports`);
			res.status(400).json({
				jsonrpc: '2.0',
				error: {
					code: -32000,
					message: 'Session not found or expired',
				},
				id: null,
			});
			return;
		}
		else {
			// No session ID and not an initialization request
			console.error('No session ID provided and request is not an initialization request');
			res.status(400).json({
				jsonrpc: '2.0',
				error: {
					code: -32000,
					message: 'Session ID required for non-initialization requests',
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
