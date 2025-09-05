# Debugging

This document covers helpful debugging processes for debugging MCP server and feature development.

## MCP Feature Testing

There are two different ways to test MCP features.

1. **[MCP Inspector](https://modelcontextprotocol.io/legacy/tools/inspector)** - _use this for testing actual output of tools, resources, etc (e.g., "raw" responses)._
2. **[MCP clients](https://modelcontextprotocol.io/docs/learn/client-concepts)** - _use these for testing how the MCP clients will actually use the features (e.g., "processed" responses)._

### Debugging Features using the MCP Inspector

The goal with testing the MCP server using an MCP Inspector is to make sure the server is sending the expected "raw" responses. The MCP Inspector DOES NOT use any LLM models and simply calls the [tools, resources, etc.](https://modelcontextprotocol.io/docs/learn/server-concepts#core-building-blocks) that the server offers and returns the raw response.

**This is most useful to review the size of your responses.** It's critical to ensure your MCP server doesn't consume unnecessary tokens; testing with the MCP Inspector is _crucial_ since it's the only way to view the raw data response that gets used by connected clients.

The MCP Inspector can be used to debug  a hosted MCP server deployment. It can't be used to test a locally-running MCP server due to issues with self-signed certificates. We can fix this using an `ngrok` tunnel, but it might not be worth the extra effort for now.

### Debugging Features using an MCP Client

The goal with testing the MCP server using an MCP client is to test how the server's features get use`d. You're generally looking to see if the client uses the tools as you expect them to.

If the server's features aren't being used as-expected, the testing process generally involves making tweaks to prompts, descriptions and feature logic and testing your changes. The feature logic changes are a given, but _do not underestimate the importance of editing prompts and descriptions_. If descriptions and prompts are too vague, or inaccurate, the client may not know to use them at the right times.
