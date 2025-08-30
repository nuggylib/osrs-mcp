import { transports } from './proxy/cache/cache';
import proxyServer from './proxy/server';
import https from 'https';
import http from 'http';
import fs from 'fs';

import './tools'
import './resources'

const MCP_PORT = parseInt(process.env.PORT || '3000', 10)

if (process.env.NODE_ENV === 'production') {
	// Production: Heroku handles HTTPS termination, we serve HTTP
	if (process.env.HEROKU) {
		http.createServer(proxyServer).listen(MCP_PORT, '0.0.0.0', () => {
			console.log(`HTTP Server running on http://0.0.0.0:${MCP_PORT} (Heroku HTTPS termination)`);
		});
	} else {
		// Other production environments with certs
		try {
			const options = {
				key: fs.readFileSync('/app/certs/server.key'),
				cert: fs.readFileSync('/app/certs/server.crt'),
			};
			https.createServer(options, proxyServer).listen(MCP_PORT, '0.0.0.0', () => {
				console.log(`HTTPS Server running on https://0.0.0.0:${MCP_PORT}`);
			});
		} catch (error) {
			console.error('Failed to load certificates:', error);
			// Fallback to HTTP if certs don't exist
			http.createServer(proxyServer).listen(MCP_PORT, '0.0.0.0', () => {
				console.log(`HTTP Server running on http://0.0.0.0:${MCP_PORT}`);
			});
		}
	}
} else {
	// Development HTTPS (self-signed)
	try {
		const options = {
			key: fs.readFileSync('./certs/server.key'),
			cert: fs.readFileSync('./certs/server.crt'),
		};
		https.createServer(options, proxyServer).listen(MCP_PORT, '0.0.0.0', () => {
			console.log(`HTTPS Server running on https://0.0.0.0:${MCP_PORT}`);
		});
	} catch {
		// Fallback to HTTP if certs don't exist
		http.createServer(proxyServer).listen(MCP_PORT, '0.0.0.0', () => {
			console.log(`HTTP Server running on http://0.0.0.0:${MCP_PORT}`);
		});
	}
}

// Handle server shutdown
process.on('SIGINT', async () => {
	console.log('Shutting down server...');
	// Close all active transports to properly clean up resources
	for (const sessionId in transports) {
		try {
			console.log(`Closing transport for session ${sessionId}`);
			await transports[sessionId].close();
			delete transports[sessionId];
		}
		catch (error) {
			console.error(`Error closing transport for session ${sessionId}:`, error);
		}
	}
	console.log('Server shutdown complete');
	process.exit(0);
});
