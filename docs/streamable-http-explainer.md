# Streamable HTTP Explainer

This document serves to explain what the Streamable HTTP Transport is and why we are using it.

## What is a [Transport](https://modelcontextprotocol.io/docs/learn/architecture#transport-layer)?

From Model Context Protocol's documentation:
> The transport layer manages communication channels and authentication between clients 
> and servers. It handles connection establishment, message framing, and secure communication 
> between MCP participants.

There are 2 non-deprecated Transports:
1. **STDIO**
2. **Streamable HTTP** _(what this project uses)_

## Rationale
The main reason we want to use Streamable HTTP Transport supports streaming events back 
to the client (e.g., Claude Desktop). This is less important early on, but will be necessary
if/when we want to support the MCP Server performing some action on a RuneLite hook.

### Strengths
An MCP Server built using the Streamble HTTP Transport offers many benefits:
- Session management
- Events-streaming back to clients

### Drawbacks
The Streamable HTTP Transport is a lot more complicated to setup and configure than STDIO:
- You're introducing network calls into the picture
- Codebase is unavoidably more complex
- Client configuration with Streamable HTTP servers is more complex than with STDIO
