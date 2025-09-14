# Logging
There are two methods of logging in this application that serve different purposes:
1. **Base server logs** - _Logs intended to track underlying server functionality._
	- The MCP Server logging is NOT available in these areas as they require a client to be connected.
2. **MCP Server logs** - _Logs intended to track functionality of the MCP Server_
	- The MCP Server logging IS available in these areas
	- These logs are returned to the caller (MCP Inspector, Claude Desktop, etc.)
