# Connecting Clients
Since this server is setup to function using the 
[Streamable HTTP Transport](./streamable-http-explainer.md), you need to connect Client
applications, such as Claude Desktop, as though it were a remote MCP Server, even if
you're running it locally on your machine.

## [Connecting to Remote MCP Servers](https://modelcontextprotocol.io/docs/tutorials/use-remote-mcp-server)
Follow the documentation in this section heading link to see the full information
on connecting to a remote MCP Server.

In summary:
- If using Claude, connect to a remote MCP Server using a **Custom Connector**
- Your MCP Server _MUST_ use `https://`
