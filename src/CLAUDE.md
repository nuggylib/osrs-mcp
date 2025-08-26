# Directory Structure

## Root files
- `server.ts` contains the logic to start up the `@modelcontextprotocol/sdk` `MCPServer`.
   - Also imports the tools and resources to ensure they are registered.

## Nested directories
- `resources/` contains `@modelcontextprotocol/sdk` resource implementations.
- `tools/` contains `@modelcontextprotocol/sdk` tool implementations.
- `types/` contains internally-defined TypeScript type definitions.
- `utils/` contains various helper files and shared logic.
