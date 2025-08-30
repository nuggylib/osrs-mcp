# Deployment Guide for OSRS MCP Server as a Custom Connector

This guide explains how to deploy your OSRS MCP server as a Custom Connector for Claude.

## Prerequisites

- A publicly accessible HTTPS domain
- SSL certificates for your domain
- Docker (for containerized deployment)

## 1. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the variables:
```bash
# Your public domain
BASE_URL=https://your-domain.com

# Production environment
NODE_ENV=production
```

## 2. SSL Certificate Setup

Your server must use HTTPS in production. Place your SSL certificates in the appropriate location:

**For Docker deployment:**
- Mount certificates to `/app/certs/server.key` and `/app/certs/server.crt`

**For direct deployment:**
- Place certificates in `./certs/server.key` and `./certs/server.crt`

## 3. Deploy the Server

### Option A: Docker Deployment

```bash
# Build the image
yarn build

# Run with certificates mounted
docker run -d \
  -p 3000:3000 \
  -v /path/to/your/certs:/app/certs \
  -e NODE_ENV=production \
  -e BASE_URL=https://your-domain.com \
  --name osrs-mcp \
  osrs-mcp:latest
```

### Option B: Direct Node.js Deployment

```bash
# Install dependencies
yarn install

# Build TypeScript
yarn tsc --outDir build

# Set environment variables
export NODE_ENV=production
export BASE_URL=https://your-domain.com

# Start the server
node build/server.js
```

## 4. Test OAuth Endpoints

Verify your OAuth implementation is working:

### Check Server Metadata
```bash
curl https://your-domain.com/.well-known/oauth-authorization-server
```

### Register a Test Client
```bash
curl -X POST https://your-domain.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "redirect_uris": ["https://claude.ai/oauth/callback"],
    "client_name": "Test Client",
    "grant_types": ["authorization_code"]
  }'
```

## 5. Register as Custom Connector

1. Go to Claude.ai
2. Navigate to Settings > Custom Connectors
3. Click "Add Custom Connector"
4. Enter your server details:
   - **Name**: OSRS Wiki MCP Server
   - **Description**: Access Old School RuneScape wiki information and tools
   - **Server URL**: `https://your-domain.com`
   - **OAuth Authorization URL**: `https://your-domain.com/authorize`
   - **OAuth Token URL**: `https://your-domain.com/token`

## 6. Security Considerations

- **HTTPS Only**: Never run OAuth in production without HTTPS
- **Token Expiration**: Tokens expire after 1 hour by default
- **CORS Configuration**: Only allows requests from claude.ai domains
- **PKCE Required**: All OAuth flows require PKCE for security
- **Secure Storage**: In production, replace in-memory storage with a database

## 7. Monitoring and Logs

Monitor your server logs for:
- OAuth registration attempts
- Authentication failures
- MCP session creation/cleanup
- API rate limiting (if implemented)

## 8. Troubleshooting

### Common Issues:

1. **Certificate Errors**: Ensure your SSL certificates are valid and properly mounted
2. **CORS Issues**: Check that your domain is correctly configured in the CORS settings
3. **OAuth Failures**: Verify redirect URIs match exactly between registration and authorization
4. **Token Expiration**: Implement token refresh if needed for long-running sessions

### Debug Mode:

For testing, you can temporarily disable HTTPS certificate validation:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```

**⚠️ WARNING: Never use this in production!**

## 9. Production Checklist

- [ ] HTTPS certificates installed and valid
- [ ] Environment variables set correctly
- [ ] CORS configuration allows claude.ai
- [ ] OAuth endpoints responding correctly
- [ ] MCP endpoints protected with authentication
- [ ] Server accessible from public internet
- [ ] Monitoring and logging configured
- [ ] Backup and recovery plan in place