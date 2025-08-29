# Tech Stack
- TypeScript implementation of a Model Context Protocol server using `@modelcontextprotocol/sdk`.
   - Documentation resource (SDK Codebase): https://github.com/modelcontextprotocol/typescript-sdk
   - Package includes examples in `@modelcontextprotocol/sdk/dist/cjs/examples`
- Relies heavily on the OSRS Wiki API for all "knowledgebase" operations.
   - Documentation resource: https://runescape.wiki/w/Application_programming_interface
- MCP Server is built as a Docker Image using `docker-compose`.
   - An MCP Inspector instance is spun up along side the MCP Server.

# Bash Commands
- `yarn build`: Builds the MCP server.

# Repository Etiquette
- ALWAYS use `yarn`, NEVER `npm`.

# Project Structure
- `.github/` contains GitHub-specific configurations (for things like PR templates and Actions).
- `.vscode/` contains project-specific VS Code settings.
- `docs/` contains repository documentation.
- `fixtures/` contains static files intended to be used as data sources for Resources.
- `src/` contains all code.
