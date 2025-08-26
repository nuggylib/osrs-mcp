# Directory Structure
This directory is intended to be imported in the root `../server.ts` file to ensure all resources
are registered when the MCP Server starts up.

## Root Files
- `index.ts` is simply a "barrel" file that imports from all nested directories.

## Nested Directories
This directory contains `@modelcontextprotocol/sdk` resource definitions. Every nested directory is 
expected to contain its own root `index.ts` barrel file that imports all resources in the shared directory.
- `wiki/` contains `@modelcontextprotocol/sdk` resources related to the OSRS Wiki API.
