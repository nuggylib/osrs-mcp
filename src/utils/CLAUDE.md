# Directory Structure
This directory contains various utility files that contain helper logic or shared implementations.
- `constants.ts` contains commonly used constants across the entire codebase.
- `osrsWiki.ts` contains the `wikijs` implementation for the OSRS MediaWiki API.
   - `wikijs` does not export its types, so we have a mirror of their internally-defined types in `../types/wikijs.ts`.
- `mcpServer.ts` contains the base `@modelcontextprotocol/sdk` `MCPServer` initialization.
	- This is used by the root `../server.ts` file as well as all tools and resources.
