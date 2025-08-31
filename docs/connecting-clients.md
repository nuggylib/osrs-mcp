# Connecting Clients
Since this server is setup to function using the 
[Streamable HTTP Transport](./streamable-http-explainer.md), you need to connect Client
applications, such as Claude Desktop, as though it were a remote MCP Server, even if
you're running it locally on your machine.

## Connecting to a Heroku Instance

### Claude Desktop
1. Open "Settings" > "Connectors"
2. Click "Add a Custom Connector"
3. Set the name to whatever you'd like
4. Set the URL to `https://<SOME_APP_IDENTIFIER>.herokuapp.com/mcp`
5. Click "Connect"
