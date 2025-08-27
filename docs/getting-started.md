# Getting Started with OSRS MCP Server

This guide will walk you through building, running, and testing the OSRS MCP Server as a containerized application.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for docker-compose deployment)
- `curl` or similar HTTP client for testing

## Building the Application

### Build the Docker Image

To build the OSRS MCP Server Docker image, run the following command from the project root:

```bash
yarn build
```

Or alternatively, use Docker directly:

```bash
docker build -t osrs-mcp:latest .
```

This will create a Docker image tagged as `osrs-mcp:latest`.

## Running the Application

### Method 1: Using Docker CLI

To run the server using the Docker CLI:

```bash
docker run -d --name osrs-mcp-server -p 3000:3000 osrs-mcp:latest
```

Options explained:
- `-d`: Run in detached mode (background)
- `--name osrs-mcp-server`: Name the container for easy reference
- `-p 3000:3000`: Map container port 3000 to host port 3000

To run interactively (see logs in real-time):

```bash
docker run -it --rm -p 3000:3000 osrs-mcp:latest
```

Options explained:
- `-it`: Run interactively with TTY
- `--rm`: Remove container after it stops

### Method 2: Using Docker Compose

Start the server using docker-compose:

```bash
docker-compose up -d
```

To see logs while starting:

```bash
docker-compose up
```

To stop the server:

```bash
docker-compose down
```

## Checking Server Logs

### For Docker CLI Deployment

View logs of a running container:

```bash
docker logs osrs-mcp-server
```

Follow logs in real-time:

```bash
docker logs -f osrs-mcp-server
```

Show last 50 lines:

```bash
docker logs --tail 50 osrs-mcp-server
```

### For Docker Compose Deployment

View logs:

```bash
docker-compose logs
```

Follow logs in real-time:

```bash
docker-compose logs -f
```

View logs for specific service:

```bash
docker-compose logs osrs-mcp
```

## Testing the Server

### Health Check

Once the server is running, you can test it using curl. The following command sends an initialization request to the MCP server:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    },
    "id": 1
  }'
```

### Expected Response

A successful response will include:
- HTTP 200 OK status
- A `mcp-session-id` header with the session ID
- Server capabilities and information in the response body

Example response structure:
```
HTTP/1.1 200 OK
mcp-session-id: <session-uuid>
Content-Type: text/event-stream

event: message
data: {"result":{"protocolVersion":"2024-11-05","capabilities":{...},"serverInfo":{...}},"jsonrpc":"2.0","id":1}
```

### Troubleshooting

If the server doesn't respond:
1. Check if the container is running: `docker ps`
2. Check the logs for errors: `docker logs osrs-mcp-server`
3. Ensure port 3000 is not already in use
4. Verify the Docker image built successfully

## Stopping the Server

### Docker CLI

Stop the container:
```bash
docker stop osrs-mcp-server
```

Remove the container:
```bash
docker rm osrs-mcp-server
```

### Docker Compose

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes:
```bash
docker-compose down -v
```