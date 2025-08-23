# Directory Structure

- `constants.ts` contains commonly used constants across the entire codebase.
- `osrsWiki.ts` contains the `wikijs` implementation for the OSRS MediaWiki API.
   - `wikijs` does not export its types, so we have a mirror of their internally-defined types in `../types/wikijs.ts`.
