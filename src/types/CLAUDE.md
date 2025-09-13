# Directory Structure
This directory contains files with TypeScript definitions to be used throughout the project.
- `auth.ts` contains authentication-related types.
- `osrsMcp.ts` contains app-specific types, generally inferred (using `zod`) from the objects defined in the `../zod/` directory.
- `osrsWiki.ts` contains types that reflect the shape of data responses from the OSRS Wiki API.
- `wikimedia.ts` contains general type definitions related to WikiMedia.
   - These types are generally only used by the types in `osrsWiki.ts` as a means to separate out what is controlled by the OSRS Wiki and not.
