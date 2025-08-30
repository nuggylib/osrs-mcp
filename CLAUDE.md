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
See `DEPLOYMENT.md` for complete deployment instructions including:
- Environment configuration
- SSL certificate setup
- Public deployment options
- Custom Connector registration in Claude

# Repository Etiquette
- ALWAYS use `yarn`, NEVER `npm`.

# Project Structure
- `.github/` contains GitHub-specific configurations (for things like PR templates and Actions).
- `.vscode/` contains project-specific VS Code settings.
- `docs/` contains repository documentation.
- `fixtures/` contains static files intended to be used as data sources for Resources.
- `src/` contains all code.
