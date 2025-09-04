# Testing

This document covers all of the core steps for testing this server. Make sure you have completed all of the steps in the [Getting Started document](./getting-started.md).

## MCP Clients

To test using MCP clients such as Claude Desktop, you need to add the MCP server as a remote MCP Server. Claude Desktop doesn't play nicely with self-signed certificates, so it's much easier to target an instance of the OSRS MCP server running in Heroku. See [Connecting MCP Clients](./connecting-clients.md) for instructions.

## MCP Inspector

You can use the MCP Inspector to test both a locally-running instance of the OSRS MCP server, as well as a deployed one.

Since the MCP server leverages OAuth, you must provide a Bearer token when connecting to the MCP server.

### Obtaining a Bearer Token

In order to test the server in _any_ setting (local or deployment), you must first obtain a Bearer token from the server. The core commands to do this are the same, just targeting different URLs.

This is a two-step process.

> [!TIP]
> Use the `yarn test:deployment` command to automatically complete this two-step process. It accepts a deployment URL (`BASE_URL`)as an argument.

#### Step 1 - Register with the MCP Server

Run the following command to register with the server. Make sure to replace `<BASE_URL>` with the actual base URL of your MCP server. If it's deployed, use the appropriate Heroku deployment URL.

```sh
curl -X POST <BASE_URL>/register \
    -H "Content-Type: application/json" \
    -d '{
      "redirect_uris": ["http://localhost:6274/oauth/callback"],
      "client_name": "MCP Inspector",
      "grant_types": ["authorization_code", "client_credentials"]
    }'
```

This will give will give you a `client_id` and `client_secret` in the response:

```sh
{"client_id":"<CLIENT_ID>","client_secret":"<CLIENT_SECRET>","client_id_issued_at":1756620361,"client_secret_expires_at":0,"redirect_uris":["http://localhost:6274/oauth/callback"],"grant_types":["authorization_code","client_credentials"],"response_types":["code"],"client_name":"MCP Inspector"}
```

#### Step 2 - Obtain the Bearer token

Run the following command to get a Bearer token from the MCP server (you will need the `client_id` and `client_secret` from Step 1).

> [!NOTE]
> Make sure to replace `<BASE_URL>`, `<CLIENT_ID>`, and `<CLIENT_SECRET>` with the actual values.

```sh
curl -X POST <BASE_URL>/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>"
```

This will produce a response containing an `access_token`, which is the value you need to use as the Bearer token:

```sh
{"access_token":"<SOME_BEARER_TOKEN>","token_type":"Bearer","expires_in":3600,"scope":"osrs:read"}
```

### Using the MCP Inspector

Depending on what environment you're targeting, run either:

- `yarn inspector:local` to start the inspector, targeted at the locally-running server.
- `yarn inspector:heroku` to start the inspector, targeted at the Heroku deployment.

Once running, set the following configurations in the interface:

> [!NOTE]
> Make sure to replace `BASE_URL` with the actual base URL of your MCP server.

- **Transport Type**: _Streamable HTTP_
- **URL**: _Set to the appropriate `BASE_URL`+`/mcp`_

Then, expand the "Authentication" dropdown and set the following configurations:

- **Header Name**: _Leave blank (so it uses `Authorization` as the value)._
- **Bearer Token**: _The Bearer token retreived from the MCP Server after registering._ - DO NOT prefix with `Bearer `; this is automatically-appended by the Inspector in the request.
- **Redirect URL**: _Not editable._
- **Scope**: _Leave blank._

Once you have all of the values set correctly, click "Connect" and you're ready to test! When it comes to knowing what to look for in testing, please review the [Debugging document](./debugging.md).
