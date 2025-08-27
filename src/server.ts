// Import all tools and resources to trigger their registration
import './tools/index.js';
import './resources/index.js'
import { server } from './utils/mcpServer.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'crypto';
import express from 'express';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Create Express app
const app = express();
app.use(express.json());

// MCP POST endpoint - handles client-to-server communication
app.post('/mcp', async (req, res) => {
	const sessionId = req.headers['mcp-session-id'] as string | undefined;

	if (sessionId) {
		console.log(`Received MCP request for session: ${sessionId}`);
	}

	try {
		let transport: StreamableHTTPServerTransport;

		if (sessionId && transports[sessionId]) {
			// Reuse existing transport
			transport = transports[sessionId];
		} else if (!sessionId && isInitializeRequest(req.body)) {
			// New initialization request
			transport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => randomUUID(),
				onsessioninitialized: (sessionId) => {
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

			// Connect the transport to the MCP server
			await server.connect(transport);
			await transport.handleRequest(req, res, req.body);
			return;
		} else {
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

		// Handle the request with existing transport
		await transport.handleRequest(req, res, req.body);
	} catch (error) {
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
});

// MCP GET endpoint - handles server-to-client notifications via SSE
app.get('/mcp', async (req, res) => {
	const sessionId = req.headers['mcp-session-id'] as string | undefined;

	if (!sessionId || !transports[sessionId]) {
		res.status(400).send('Invalid or missing session ID');
		return;
	}

	const lastEventId = req.headers['last-event-id'] as string | undefined;
	if (lastEventId) {
		console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`);
	} else {
		console.log(`Establishing new SSE stream for session ${sessionId}`);
	}

	const transport = transports[sessionId];
	await transport.handleRequest(req, res);
});

// MCP DELETE endpoint - handles session termination
app.delete('/mcp', async (req, res) => {
	const sessionId = req.headers['mcp-session-id'] as string | undefined;

	if (!sessionId || !transports[sessionId]) {
		res.status(400).send('Invalid or missing session ID');
		return;
	}

	console.log(`Received session termination request for session ${sessionId}`);

	try {
		const transport = transports[sessionId];
		await transport.handleRequest(req, res);
	} catch (error) {
		console.error('Error handling session termination:', error);
		if (!res.headersSent) {
			res.status(500).send('Error processing session termination');
		}
	}
});

// Start the Express server
const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () => {
	console.log(`OSRS MCP Server listening on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
	console.log('Shutting down server...');

	// Close all active transports
	for (const sessionId in transports) {
		try {
			console.log(`Closing transport for session ${sessionId}`);
			await transports[sessionId].close();
			delete transports[sessionId];
		} catch (error) {
			console.error(`Error closing transport for session ${sessionId}:`, error);
		}
	}

	// Close the HTTP server
	httpServer.close(() => {
		console.log('Server shutdown complete');
		process.exit(0);
	});

	// Force exit after 10 seconds
	setTimeout(() => {
		console.error('Could not close connections in time, forcefully shutting down');
		process.exit(1);
	}, 10000);
});
