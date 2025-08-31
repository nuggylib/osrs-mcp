# Debugging
This document covers helpful debugging processes for debugging MCP server and feature
development.

## MCP Feature Testing
There are two different ways to test MCP features.
1. **MCP Inspector** - _use this for testing actual output of tools, resources, etc (e.g., "raw" responses)._
2. **LLM Client** - _use these for testing how the LLM clients will actually use the features (e.g., "processed" responses)._

### Debugging features via the MCP Inspector
The goal with testing the MCP Server using an MCP Inspector is to make sure the server is sending
the expected "raw" responses. The MCP Inspector DOES NOT use any LLM models and simply calls the
Tools, Resources, etc. that the server offers and returns the raw response.

**This is most useful to review the size of your responses.** It's critical to ensure your MCP
Server doesn't consume unnecessary tokens; testing with the MCP Inspector is _crucial_ since
it's the only way to view the raw data response that gets used by connected clients.

The MCP Inspector can be used to debug either a locally-running MCP Server, or one hosted in
a deployment. The only difference is the endpoint you target. See the [Testing document](./testing.md#using-the-mcp-inspector) for more information.

### Debugging features with a Client
The goal with testing the MCP Server using a Client is to test how the server's features get
used. You're generally looking to see if the Client uses the tools as you expect them to.

If the server's features aren't being used as-expected, the testing process generally involves
making tweaks to prompts, descriptions and feature logic and testing your changes. The feature
logic changes are a given, but _do not underestimate the importance of editing prompts and
descriptions_. If descriptions and prompts are too vague, or inaccurate, the Client may not
know to use them at the right times.
