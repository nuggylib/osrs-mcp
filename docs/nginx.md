# Nginx Reverse Proxy Setup

This directory contains the Nginx configuration for setting up a reverse proxy to the OSRS MCP server.

## Usage

The Nginx reverse proxy is included in the Docker Compose setup and will automatically start when you run:

```bash
docker-compose up -d --build
```

This will:
1. Start the MCP server on port 3000 (internal HTTP, Docker network only)
2. Start Nginx reverse proxy on port 80 (mapped to localhost:80)
3. Route requests from `dev-osrs-mcp.mcnuggies.dev` to the MCP server

## Accessing the Server

- **Via domain**: `http://dev-osrs-mcp.mcnuggies.dev` (or `https://` if your registrar handles SSL)
- **Via localhost**: `http://localhost`

## SSL/HTTPS Support

The MCP server runs on HTTP only - SSL termination is handled by:
- Your DNS registrar (for production domains)
- Reverse proxy/load balancer (for cloud deployments)
- Local development uses HTTP only

## Configuration Files

- `nginx/nginx.conf` - Main Nginx configuration
- `nginx/conf.d/osrs-mcp.conf` - Server-specific configuration with reverse proxy rules

## Notes

- The proxy uses the internal Docker network to communicate with the MCP server via `osrs-mcp:3000`
- WebSocket connections are supported for real-time communication
- Health check endpoint available at `/health`
- All requests are logged for debugging purposes
- No SSL certificates needed - handled externally