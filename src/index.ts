import { transports } from './server/cache/cache';
import { redis } from './server/cache/redisStore';
import proxyServer from './server'
import http from 'http';

import './tools'
import './resources'

const MCP_PORT = parseInt(process.env.PORT || '3000', 10)

// Always use HTTP - SSL termination is handled by reverse proxy/registrar
http.createServer(proxyServer).listen(MCP_PORT, '0.0.0.0', () => {
	// Can't send normal MCP logging message here since no clients have connected yet
	console.log(`HTTP Server running on http://0.0.0.0:${MCP_PORT}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
	// Can't send MCP logging messages during shutdown since clients may have disconnected
	console.log('Shutting down server...');
	// Close all active transports to properly clean up resources
	for (const sessionId in transports) {
		try {
			console.log(`Closing transport for session ${sessionId}`);
			await transports[sessionId].close();
			delete transports[sessionId];
		}
		catch (error) {
			console.error(`Error closing transport for session ${sessionId}:`,
				error instanceof Error ? error.message : String(error));
		}
	}
	// Close Redis connection
	try {
		await redis.quit();
		console.log('Redis connection closed');
	} catch (error) {
		console.error('Error closing Redis connection:',
			error instanceof Error ? error.message : String(error));
	}
	console.log('Server shutdown complete');
	process.exit(0);
});

