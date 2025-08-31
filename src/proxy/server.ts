import express from 'express'
import cors from 'cors'
import { mcpPostHandler } from './routes/MCPPostHandler';
import { mcpGetHandler } from './routes/MCPGetHandler';
import { mcpDeleteHandler } from './routes/MCPDeleteHandler';
import { getAuthorizationServerMetadata } from './util/getAuthorizationServerMetadata';
import { authorizeGetHandler, registerClientPostHandler, tokenPostHandler } from './routes';
import { authenticateTokenMiddleware } from './middlewares';

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
			'host.docker.internal',
			// Allow Claude.ai for custom connectors
			'claude.ai',
			'www.claude.ai',
		];

		if (allowedOrigins.includes(originHostname)) {
			callback(null, true);
		} else {
			console.warn(`Blocked request from unauthorized origin: ${origin}`);
			callback(new Error('Not allowed by CORS'), false);
		}
	},
	methods: ['GET', 'POST', 'DELETE'],
	allowedHeaders: ['Content-Type', 'mcp-session-id', 'last-event-id', 'Authorization'],
	credentials: true,
};

// Apply CORS globally for DNS rebinding protection
app.use(cors(corsOptions));

// Add JSON body parsing middleware and URL encoding
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// OAuth Server Metadata endpoint (RFC 8414)
app.get('/.well-known/oauth-authorization-server', (req, res) => {
	res.json(getAuthorizationServerMetadata());
});

// OAuth endpoints
app.post('/register', registerClientPostHandler);
app.get('/authorize', authorizeGetHandler);
app.post('/token', tokenPostHandler);

// MCP endpoints with OAuth protection
app.post('/mcp', authenticateTokenMiddleware, mcpPostHandler);
app.get('/mcp', authenticateTokenMiddleware, mcpGetHandler);
app.delete('/mcp', authenticateTokenMiddleware, mcpDeleteHandler);

export default app;
