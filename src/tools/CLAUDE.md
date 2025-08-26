# Directory Structure
This directory is intended to be imported in the root `../server.ts` file to ensure all tools
are registered when the MCP Server starts up.

## Root Files
- `index.ts` is simply a "barrel" file that imports from all nested directories.

## Nested Directories
This directory contains `@modelcontextprotocol/sdk` tool definitions. Every nested directory is 
expected to contain its own root `index.ts` barrel file that imports all tools in the shared directory.
- `wiki/` contains `@modelcontextprotocol/sdk` tools that work with the OSRS Wiki API.
