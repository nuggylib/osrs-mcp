import express from 'express'
import cors from 'cors'
import { mcpPostHandler } from './routes/MCPPostHandler';
import { mcpGetHandler } from './routes/MCPGetHandler';
import { mcpDeleteHandler } from './routes/MCPDeleteHandler';

const app = express()

// CORS configuration for DNS rebinding protection
const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		// Allow requests without origin (direct API calls, mobile apps, etc.)
		if (!origin) {
			return callback(null, true);
		}

		let originHostname: string;
		try {
			originHostname = new URL(origin).hostname;
		} catch {
			return callback(new Error('Invalid origin'), false);
		}

		// Allowed origins for local development and production
		const allowedOrigins = [
			'localhost',
			'127.0.0.1',
			'::1',
			// Allow Docker host machine access for MCP Inspector
			'host.docker.internal'
		];

		if (allowedOrigins.includes(originHostname)) {
			callback(null, true);
		} else {
			console.warn(`Blocked request from unauthorized origin: ${origin}`);
			callback(new Error('Not allowed by CORS'), false);
		}
	},
	methods: ['GET', 'POST', 'DELETE'],
	allowedHeaders: ['Content-Type', 'mcp-session-id', 'last-event-id'],
	credentials: false
};

// Apply CORS globally for DNS rebinding protection
app.use(cors(corsOptions));

// Add JSON body parsing middleware
app.use(express.json())

// TODO: Uncomment if/when we support OAuth
// if (useOAuth && authMiddleware) {
// 	app.post('/mcp', authMiddleware, mcpPostHandler);
//	app.get('/mcp', authMiddleware, mcpGetHandler);
//	app.delete('/mcp', authMiddleware, mcpDeleteHandler);
// }
// else {
//	app.post('/mcp', mcpPostHandler);
//	app.get('/mcp', mcpGetHandler);
//	app.delete('/mcp', mcpDeleteHandler);
// }

// TODO: Remove these lines once the conditional OAuth code is uncommented and in-use
app.post('/mcp', mcpPostHandler);
app.get('/mcp', mcpGetHandler);
app.delete('/mcp', mcpDeleteHandler);

export default app;
