# Summary

<!-- A summary of the changes -->

Switches the MCP Server architecture from an STDIO-based implementation to Streamable HTTP. This also required the server to be implemented as a Streamable HTTP server instead of an STDIO server.

## MCP Inspector QA

1. Run `docker-compose up -d --build` to build the image and start the containers
2. Open the Docker Logs > Locate the URL with the `MCP_PROXY_AUTH_TOKEN` appended at the end
3. Click the link to open the MCP Inspector > Set URL to `http://osrs-mcp:3000/mcp`
4. Click "Connect"
5. _TODO_
