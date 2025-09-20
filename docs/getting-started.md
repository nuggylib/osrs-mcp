# Getting Started with OSRS MCP Server

This guide will walk you through building, running, and testing the OSRS MCP Server as a containerized application.

## Prerequisites

- Docker installed on your system.
- Docker Compose (optional, for `docker-compose` deployment).
- Node.js with Corepack enabled (for Yarn package manager).
- The SSL certificate bundle for `mcnuggies.dev`.

## Setting up Yarn Version

This project uses Yarn 4.1.1 as specified in `package.json`. If you encounter a version mismatch error, follow these steps:

1. Enable Corepack (Node.js's built-in package manager manager):
   ```sh
   corepack enable
   ```

2. Prepare and activate the correct Yarn version:
   ```sh
   corepack prepare yarn@4.1.1 --activate
   ```

3. Verify the installation:
   ```sh
   yarn --version
   # Should output: 4.1.1
   ```

4. Install project dependencies:
   ```sh
   yarn install
   ```

## Building

- `yarn build` to build the Docker image.
- `docker-compose up -d --build` to build and start the MCP server.

## Testing

See [Testing](./testing.md) for detailed testing information.
