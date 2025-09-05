# Getting Started with OSRS MCP Server

This guide will walk you through building, running, and testing the OSRS MCP Server as a containerized application.

> **NOTE**: If you are using the Heroku deployment of the OSRS MCP server, please refer to the [Connecting MCP Clients](./connecting-clients.md) document for instructions on how to connect your MCP clients to the deployed server. You don't need to generate self-signed certificates in this case.

## Prerequisites

- Docker installed on your system.
- Docker Compose (optional, for `docker-compose` deployment).

## Generating Self-Signed Certificates

The MCP server requires SSL certificates in order to run since it uses HTTPS. To do this, first `cd` into (or create) a `certs/` directory at the project root. Then:

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

> **IMPORTANT**: Do not commit the root `.certs/` folder.

## Building

- `yarn build` to build the Docker image.
- `docker-compose up -d --build` to build and start the MCP server.

## Testing

See [Testing](./testing.md) for detailed testing information.
