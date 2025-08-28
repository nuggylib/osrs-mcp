import { transports } from './proxy/cache';
import proxyServer from './proxy/server';

const MCP_PORT = 3000

proxyServer.listen(MCP_PORT, (error) => {
	if (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
	console.log(`MCP Streamable HTTP Server listening on port ${MCP_PORT}`);
});
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
