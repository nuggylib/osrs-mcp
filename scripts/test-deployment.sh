#!/bin/bash

# Test Deployment Script
# Tests OAuth client registration and token acquisition for MCP server deployment

set -e

# Check if URL argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <BASE_URL>"
    echo "Example: $0 https://your-deployment.herokuapp.com"
    exit 1
fi

BASE_URL="$1"

# Remove trailing slash if present
BASE_URL="${BASE_URL%/}"

echo "🚀 Testing deployment at: $BASE_URL"
echo "=================================="

# Step 1: Register OAuth client
echo "📝 Step 1: Registering OAuth client..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d '{
      "redirect_uris": ["http://localhost:6274/oauth/callback"],
      "client_name": "MCP Inspector",
      "grant_types": ["authorization_code", "client_credentials"]
    }' \
    -w "HTTPSTATUS:%{http_code}")

# Extract HTTP status code
HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')

if [ "$HTTP_STATUS" -ne 200 ] && [ "$HTTP_STATUS" -ne 201 ]; then
    echo "❌ Client registration failed with HTTP status: $HTTP_STATUS"
    echo "Response: $REGISTER_BODY"
    exit 1
fi

echo "✅ Client registration successful (HTTP $HTTP_STATUS)"

# Extract client_id and client_secret using basic shell tools
if command -v jq >/dev/null 2>&1; then
    # Use jq if available
    CLIENT_ID=$(echo "$REGISTER_BODY" | jq -r '.client_id')
    CLIENT_SECRET=$(echo "$REGISTER_BODY" | jq -r '.client_secret')
else
    # Fallback to sed/grep for systems without jq
    CLIENT_ID=$(echo "$REGISTER_BODY" | sed -n 's/.*"client_id":"\([^"]*\)".*/\1/p')
    CLIENT_SECRET=$(echo "$REGISTER_BODY" | sed -n 's/.*"client_secret":"\([^"]*\)".*/\1/p')
fi

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Failed to extract client credentials from response"
    echo "Response: $REGISTER_BODY"
    exit 1
fi

echo "   Client ID: $CLIENT_ID"
echo "   Client Secret: ${CLIENT_SECRET:0:8}..." # Only show first 8 chars for security

# Step 2: Request access token
echo ""
echo "🔑 Step 2: Requesting access token..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET" \
    -w "HTTPSTATUS:%{http_code}")

# Extract HTTP status code
TOKEN_HTTP_STATUS=$(echo "$TOKEN_RESPONSE" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
TOKEN_BODY=$(echo "$TOKEN_RESPONSE" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')

if [ "$TOKEN_HTTP_STATUS" -ne 200 ]; then
    echo "❌ Token request failed with HTTP status: $TOKEN_HTTP_STATUS"
    echo "Response: $TOKEN_BODY"
    exit 1
fi

echo "✅ Token request successful (HTTP $TOKEN_HTTP_STATUS)"

# Extract token information
if command -v jq >/dev/null 2>&1; then
    ACCESS_TOKEN=$(echo "$TOKEN_BODY" | jq -r '.access_token // empty')
    TOKEN_TYPE=$(echo "$TOKEN_BODY" | jq -r '.token_type // empty')
    EXPIRES_IN=$(echo "$TOKEN_BODY" | jq -r '.expires_in // empty')
else
    ACCESS_TOKEN=$(echo "$TOKEN_BODY" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
    TOKEN_TYPE=$(echo "$TOKEN_BODY" | sed -n 's/.*"token_type":"\([^"]*\)".*/\1/p')
    EXPIRES_IN=$(echo "$TOKEN_BODY" | sed -n 's/.*"expires_in":\([0-9]*\).*/\1/p')
fi

if [ -n "$ACCESS_TOKEN" ]; then
    echo "   Access Token: ${ACCESS_TOKEN:0:20}..." # Only show first 20 chars
fi
if [ -n "$TOKEN_TYPE" ]; then
    echo "   Token Type: $TOKEN_TYPE"
fi
if [ -n "$EXPIRES_IN" ]; then
    echo "   Expires In: ${EXPIRES_IN}s"
fi

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "✅ Deployment URL: $BASE_URL"
echo "✅ Client Registration: SUCCESS"
echo "✅ Token Acquisition: SUCCESS"
echo "🎉 Deployment is working correctly!"

# Optional: Test a basic MCP endpoint if token was obtained
if [ -n "$ACCESS_TOKEN" ]; then
    echo ""
    echo "🔍 Testing MCP endpoint access..."
    MCP_RESPONSE=$(curl -s -X POST "$BASE_URL/mcp" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-script", "version": "1.0"}}}' \
        -w "HTTPSTATUS:%{http_code}" || true)
    
    MCP_HTTP_STATUS=$(echo "$MCP_RESPONSE" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
    
    if [ "$MCP_HTTP_STATUS" = "200" ]; then
        echo "✅ MCP endpoint accessible with token"
    else
        echo "⚠️  MCP endpoint returned HTTP $MCP_HTTP_STATUS (this might be expected depending on the endpoint implementation)"
    fi
fi

echo ""
echo "🎯 You can now use these credentials with Claude or the MCP Inspector:"
echo "   Base URL: $BASE_URL"
echo "   Client ID: $CLIENT_ID"
echo "   Client Secret: $CLIENT_SECRET"