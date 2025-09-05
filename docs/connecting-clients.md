# Connecting MCP Clients to a Heroku Instance

You can use an MCP client to connect to a Heroku instance of the OSRS MCP server by using the Heroku app's URL (plus the `/mcp` path).

> [!NOTE]
> We can't actually connect Claude Desktop to a locally-running MCP Server due to issues with self-signed certificates. We can change this in the future, but it's not worth the extra effort for now.

## Claude Desktop

Before continuing, make sure you have the Heroku deployment URL. You can get this from the Heroku dashboard.

1. Go to **Settings** > **Connectors**.
2. Select **Add a Custom Connector**.
3. Set the **Name** to "OSRS MCP" or whatever you'd like.
4. Set the **Remote MCP server URL** to `https://<SOME_APP_IDENTIFIER>.herokuapp.com/mcp`.
	<small>Don't forget to include the `/mcp` path.</small>
6. Select **Connect**.
