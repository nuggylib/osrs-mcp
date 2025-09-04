# Connecting MCP Clients

Since this MCP server is setup to function using the [Streamable HTTP Transport](./streamable-http-explainer.md), you need to connect [MCP client](https://modelcontextprotocol.io/docs/learn/client-concepts) applications, such as Claude Desktop, as though it were a remote MCP Server, even if you're running it locally on your machine.

## Connecting to a Heroku Instance

You can use an MCP client to connect to a Heroku instance of the OSRS MCP server by using the Heroku app's URL (plus the `/mcp` path).

### Claude Desktop

Before continuing, make sure you have the Heroku deployment URL. You can get this from the Heroku dashboard.

1. Go to **Settings** > **Connectors**.
2. Select **Add a Custom Connector**.
3. Set the **Name** to "OSRS MCP" or whatever you'd like.
4. Set the **Remote MCP server URL** to `https://<SOME_APP_IDENTIFIER>.herokuapp.com/mcp`.
	<small>Don't forget to include the `/mcp` path.</small>
6. Select **Connect**.
