# Getting Started with OSRS MCP Server

This guide will walk you through building, running, and testing the OSRS MCP Server as a containerized application.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for docker-compose deployment)

## Building

- `yarn build` to build the Docker image.
- `docker-compose up -d --build` to build and start the MCP server

## Testing

1. Run `docker-compose up -d`
2. Check the Docker Container logs to get the full URL to the inspector
	* It will look something like this: `http://0.0.0.0:6274/?MCP_PROXY_AUTH_TOKEN=<SOME_TOKEN>`
3. Set the URL field to `http://osrs-mcp:3000/mcp`
4. Click "Connect" and then test as needed
