# Directory Structure
This directory contains files with TypeScript definitions to be used throughout the project.
- `wikijs.ts` contains type definitions that align with what the `wikijs` package is using.
	- `wikijs` does not export its types, so we have to make sure our types align with what we find in `node_modules` for this package.
