# `server/` Directory
This directory contains code for the `express` server that functions as the proxy. The server is
responsible for routing requests to the underlying MCP Server and back to the client.

The implementation of this server is based on the `simpleStreamableHttp.js` example file, provided
by the `@modelcontextprotocol/sdk/` package.

## Directory Structure
Files
- `server.ts` contains the core proxy server setup, specifically adding routes.
- `cache.ts` contains a rudimentary, in-memory cache mechanism.
Folders
- `routes/` contains `express` routes.
