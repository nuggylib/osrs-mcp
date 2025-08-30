# Getting Started with OSRS MCP Server

This guide will walk you through building, running, and testing the OSRS MCP Server as a containerized application.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for docker-compose deployment)

## Generating Self-Signed Certificates
The MCP Server requires SSL certificates in order to run since it uses HTTPS. To do this, first
`cd` into (or create) a `certs/` directory at the project root. Then:

```sh
# Generate private key
openssl genrsa -out server.key 2048

# Generate certificate signing request
openssl req -new -key server.key -out server.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate (valid for 365 days)
openssl x509 -req -in server.csr -signkey server.key -out server.crt -days 365

# Clean up CSR file
rm server.csr
```

> **IMPORTANT**: Do not commit the root `.certs/` folder

## Building

- `yarn build` to build the Docker image.
- `docker-compose up -d --build` to build and start the MCP server

## Testing

1. Run `docker-compose up -d`
2. Check the Docker Container logs to get the full URL to the inspector
	* It will look something like this: `http://0.0.0.0:6274/?MCP_PROXY_AUTH_TOKEN=<SOME_TOKEN>`
3. Set the URL field to `http://osrs-mcp:3000/mcp`
4. Click "Connect" and then test as needed
