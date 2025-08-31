# Getting Started with OSRS MCP Server

This guide will walk you through building, running, and testing the OSRS MCP Server as a containerized application.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for docker-compose deployment)

## Generating Self-Signed Certificates
The MCP Server requires SSL certificates in order to run since it uses HTTPS. To do this, first
`cd` into (or create) a `certs/` directory at the project root. Then:

```sh
# Create OpenSSL configuration file with Subject Alternative Names
cat > openssl.conf << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = State
L = City
O = Organization
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Generate private key
openssl genrsa -out server.key 2048

# Generate certificate signing request with SAN config
openssl req -new -key server.key -out server.csr -config openssl.conf

# Generate self-signed certificate with SANs (valid for 365 days)
openssl x509 -req -in server.csr -signkey server.key -out server.crt -days 365 -extensions v3_req -extfile openssl.conf

# Clean up temporary files
rm server.csr openssl.conf
```

> **IMPORTANT**: Do not commit the root `.certs/` folder

## Building

- `yarn build` to build the Docker image.
- `docker-compose up -d --build` to build and start the MCP server

## Testing

### Pre-requisites
Before testing the MCP Inspector, you'll need to:
- Generate a `client_id` and `client_secret`
- Use the `client_id` and `client_secret` to obtain a `Bearer` token

#### Getting the `client_id` and `client_secret`
Use the following command to obtain a response from the server that contains the `client_id` and 
`client_secret`:
```sh
curl -X POST https://localhost:3000/register \
    -H "Content-Type: application/json" \
    -d '{
      "redirect_uris": ["http://localhost:6274/oauth/callback"],
      "client_name": "MCP Inspector",
      "grant_types": ["authorization_code", "client_credentials"]
    }'
```
* This will return a JSON object containing the fields you need

#### Getting the Bearer Token
Once you have the `client_id` and `client_secret`, you need to request an access token:
```sh
curl -X POST https://localhost:3000/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>"
```
- Replace `<CLIENT_ID>` with your actual client ID
- Replace `<CLIENT_SECRET>` with your actual client secret

The response object contains the access token to use with the `Bearer` Authorization header.

### Testing steps
Once you have the bearer token:
1. Run `docker-compose up -d`
2. Check the Docker Container logs to get the full URL to the inspector
	* It will look something like this: `http://0.0.0.0:6274/?MCP_PROXY_AUTH_TOKEN=<SOME_TOKEN>`
3. Set the URL field to `https://127.0.0.1:3000/mcp`
4. Expand the "Authentication" section
5. In the "Header Name" field, set the value to `Authorization`
6. In the Bearer Token field, paste the token from the pre-requisites (include the "Bearer " prefix)
7. In the "Client ID" field, paste the `client_id` value
8. Click "Connect" and then test as needed
