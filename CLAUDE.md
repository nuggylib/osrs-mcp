# Tech Stack
- TypeScript implementation of a Model Context Protocol server using `@modelcontextprotocol/sdk`.
   - Documentation resource (SDK Codebase): https://github.com/modelcontextprotocol/typescript-sdk
   - Package includes examples in `@modelcontextprotocol/sdk/dist/cjs/examples`
- Relies heavily on the OSRS Wiki API for all "knowledgebase" operations.
   - Documentation resource: https://runescape.wiki/w/Application_programming_interface
- MCP Server is built as a Docker Image using `docker-compose`.
   - An MCP Inspector instance is spun up along side the MCP Server.

# Bash Commands
- `docker-compose up -d --build` builds the MCP server and starts up the containers described in `docker-compose.yml`.
	- `-d` flag means "detached" and runs the containers in the background.
	- `--build` instructs Docker to build the `Dockerfile`.
- `yarn inspector` starts the MCP Inspector, useful for debugging.
- `docker-compose down` stops all containers that were started via the `docker-compose up` command.

# Custom Connector Setup
This server now supports OAuth 2.1 authentication and can be deployed as a Custom Connector for Claude.

## OAuth Features
- OAuth 2.1 compliant with PKCE required for all flows
- Dynamic client registration (RFC 7591)
- Authorization server metadata discovery (RFC 8414)
- Support for authorization code and client credentials grants
- Secure token-based authentication for all MCP endpoints

## Deployment
See `./docs/deployment.md` for complete deployment instructions.

# Repository Etiquette
- ALWAYS use `yarn`, NEVER `npm`.

# Project Structure

## Root Folders
- `.github/` contains GitHub-specific configurations (for things like PR templates and Actions).
- `.vscode/` contains project-specific VS Code settings.
- `docs/` contains repository documentation.
- `fixtures/` contains static files intended to be used as data sources for Resources.
- `src/` contains all code.

## Root Files
- `.env.example` shows what environment variables the application uses.
	- `dotenv` is not needed.
		- We set defaults for local development.
		- Deployments should already have the correct variables set.
- `docker-compose.yml` defines the containers to start when running `docker-compose`.
	- `docker-compose` is used for local development.
	- The containers can only be tested using the Inspector.
- `Dockerfile` defines how to build the MCP server as a Docker image.
	- This is currently only used in local testing.
	- Heroku deployments generate a build and don't use Docker images.
- `eslint.config.mjs` is the ESlint configuration file.
- `Procfile` defines the MCP Application process for Heroku (as well as other services).
