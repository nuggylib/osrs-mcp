# Redis Configuration and Usage

## Overview
This MCP server uses Redis for persistent caching of OAuth tokens, client registrations, and session data. Redis replaces the previous in-memory storage implementation, providing data persistence across server restarts and better scalability.

## Redis Setup

### Heroku (using Redis Cloud)
We have purchased the Redis Cloud addon for Heroku. This simply added a Redis instance in our app
stack that we point the MCP Server to for session management and caching.

#### Inspecting Redis Data
The easiest way to inspect Redis data is by using a database explorer that supports Redis; for example,
TablePlus (which is not totally free).

You can get the configuration details using the `heroku` CLI:
```sh
heroku config -a osrs-mcp | grep REDIS
```
- The URL will be formatted as `redis://default:[password]@[host]:[port]`
	- Copy the `host` to the URL field.
	- Copy the `port` to the Port field.
	- Copy the `password` to the Password field.
	- Leave the Username field blank (or, "default").

### Environment Variables
Configure Redis connection and TTL settings via environment variables:

```bash
# redis://localhost:6379 For local development, or the URL for the deployed instance
REDISCLOUD_URL=redis://redis:6379  

# TTL (Time-To-Live) settings in seconds
REDIS_TTL_TOKEN=3600      # OAuth tokens: 1 hour
REDIS_TTL_AUTH_CODE=600   # Auth codes: 10 minutes
REDIS_TTL_CLIENT=2592000  # OAuth clients: 30 days
REDIS_TTL_SESSION=604800  # Session transports: 7 days
```

### Docker Configuration
Redis runs as a service in the Docker Compose stack with the following configuration:

- **Image**: `redis:7-alpine` (lightweight Alpine Linux-based Redis)
- **Container Name**: `osrs-mcp-redis`
- **Port**: 6379 (mapped to localhost only for security)
- **Persistence**: Append-only file (AOF) enabled for data durability
- **Volume**: `redis-data` volume for persistent storage
- **Health Check**: Automatic health monitoring using `redis-cli ping`
