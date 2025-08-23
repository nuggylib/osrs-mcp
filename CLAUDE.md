# Workflow
- Start every session by setting the current date to !`echo $(date +%F)`.
- After setting the date in the session, obtain all commits back to the `main` branch.
   - Summarize the body of changes and seek approval from the user; repeat this process until the user agrees.

# Tech Stack
- TypeScript implementation of a Model Context Protocol server using `@modelcontextprotocol/sdk`.
   - Documentation resource (SDK Codebase): https://github.com/modelcontextprotocol/typescript-sdk
- Relies heavily on the OSRS Wiki API for all "knowledgebase" operations.
   - Documentation resource: https://runescape.wiki/w/Application_programming_interface
- Uses `@modelcontextprotocol/inspector` for local debugging.
   - The MCP Inspector is used to to observe MCP operations _before_ the output is processed by a client.

# Bash Commands
- `yarn build`: Builds the MCP server.
- `yarn build-and-test`: Builds the MCP server, then starts the MCP inspector tool, ready to connect to the built server.
   - Claude will NEVER use this except to advise the user for testing purposes.

# Repository Etiquette
- ALWAYS use `yarn`, NEVER `npm`.

# Project Structure
- `src/` contains all code.
- `build/` contains the latest build artifact (it will not exist until you run `build`).
   - Claude will NEVER make changes here, but is allowed to explore this code to debug potential build issues.
