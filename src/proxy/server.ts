import express from 'express'
import { mcpPostHandler } from './routes/MCPPostHandler';
import { mcpGetHandler } from './routes/MCPGetHandler';
import { mcpDeleteHandler } from './routes/MCPDeleteHandler';

const app = express()

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
