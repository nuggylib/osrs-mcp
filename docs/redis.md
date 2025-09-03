# Redis Configuration and Usage

## Overview
This MCP server uses Redis for persistent caching of OAuth tokens, client registrations, and session data. Redis replaces the previous in-memory storage implementation, providing data persistence across server restarts and better scalability.

## Redis Setup

### Docker Configuration
Redis runs as a service in the Docker Compose stack with the following configuration:

- **Image**: `redis:7-alpine` (lightweight Alpine Linux-based Redis)
- **Container Name**: `osrs-mcp-redis`
- **Port**: 6379 (mapped to localhost only for security)
- **Persistence**: Append-only file (AOF) enabled for data durability
- **Volume**: `redis-data` volume for persistent storage
- **Health Check**: Automatic health monitoring using `redis-cli ping`

### Environment Variables
Configure Redis connection and TTL settings via environment variables:

```bash
# Redis connection URL
REDIS_URL=redis://redis:6379  # Within Docker network
REDIS_URL=redis://localhost:6379  # For local development

# TTL (Time-To-Live) settings in seconds
REDIS_TTL_TOKEN=3600      # OAuth tokens: 1 hour
REDIS_TTL_AUTH_CODE=600   # Auth codes: 10 minutes
REDIS_TTL_CLIENT=2592000  # OAuth clients: 30 days
REDIS_TTL_SESSION=604800  # Session transports: 7 days
```

## Redis Operations

### Testing Redis Connection
To verify Redis is running and accessible:

```bash
docker exec osrs-mcp-redis redis-cli ping
```

**Expected Response**: `PONG`

This command:
- Executes the Redis CLI inside the running container
- Sends a PING command to the Redis server
- Returns PONG if the server is responsive
- Useful for health checks and troubleshooting connection issues

### Inspecting Stored Keys
To view all keys currently stored in Redis:

```bash
docker exec osrs-mcp-redis redis-cli keys '*'
```

**What this command does**:
- Lists all keys in the Redis database
- Uses the wildcard pattern `*` to match all keys
- Returns an empty result if no keys are stored

**Why you'd need it**:
- **Debugging**: Verify data is being stored correctly
- **Monitoring**: Check for orphaned or expired keys
- **Development**: Understand the key naming patterns used by the application
- **Troubleshooting**: Investigate caching issues or missing data

### Key Naming Patterns
The application uses structured key names for organization:

- `oauth:client:{client_id}` - OAuth client registrations
- `oauth:token:{token}` - OAuth access tokens
- `oauth:authcode:{code}` - OAuth authorization codes
- `session:transport:{sessionId}` - MCP session metadata

### Additional Useful Commands

```bash
# Get the value of a specific key
docker exec osrs-mcp-redis redis-cli get "oauth:token:example_token"

# Check remaining TTL for a key (in seconds)
docker exec osrs-mcp-redis redis-cli ttl "oauth:authcode:example_code"

# Count total number of keys
docker exec osrs-mcp-redis redis-cli dbsize

# Monitor Redis commands in real-time (useful for debugging)
docker exec -it osrs-mcp-redis redis-cli monitor

# Clear all data (use with caution!)
docker exec osrs-mcp-redis redis-cli flushall
```

## Data Persistence

Redis is configured with AOF (Append Only File) persistence:
- All write operations are logged to disk
- Data survives container restarts
- Stored in the Docker volume `redis-data`
- Can be backed up by backing up the volume

To backup Redis data:
```bash
docker run --rm -v osrs-mcp_redis-data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz /data
```

To restore Redis data:
```bash
docker run --rm -v osrs-mcp_redis-data:/data -v $(pwd):/backup alpine tar xzf /backup/redis-backup.tar.gz -C /
```

## Troubleshooting

### Redis Connection Errors
If the application cannot connect to Redis:

1. Verify Redis container is running:
   ```bash
   docker-compose ps
   ```

2. Check Redis logs:
   ```bash
   docker-compose logs redis
   ```

3. Test connection from the MCP container:
   ```bash
   docker exec osrs-mcp-server sh -c "nc -zv redis 6379"
   ```

### Port Conflicts
If port 6379 is already in use:

1. Stop conflicting services:
   ```bash
   # On macOS
   brew services stop redis
   
   # On Linux
   sudo systemctl stop redis
   ```

2. Or modify `docker-compose.yml` to use a different port:
   ```yaml
   ports:
     - "127.0.0.1:6380:6379"
   ```

### Memory Issues
Monitor Redis memory usage:
```bash
docker exec osrs-mcp-redis redis-cli info memory
```

Redis will automatically evict keys when memory is full based on the eviction policy (default: noeviction).