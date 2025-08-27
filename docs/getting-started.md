# Getting Started with OSRS MCP Server

This guide will walk you through building, running, and testing the OSRS MCP Server as a containerized application.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for docker-compose deployment)

## Building

- `yarn build` to build the Docker image.
- `docker-compose up -d --build` to build and start the MCP server

## Testing

Once the Docker container is running, you can connect to it at `http://127.0.0.1:6274/`
