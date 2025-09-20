## Directory Structure
This directory contains Zod definitions that are intended to be used directly
by this MCP server's Tools.

## Code Structure
- Each file contains a separate object definition.
- Each object exported by these files are intended to be used by the `outputSchema` for the MCP Server Tool definitions.
- Each object is also used in the `../types/osrsMcp.ts` file to export a TS Type for each exported object from the `zod/` directory.