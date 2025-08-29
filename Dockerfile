# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Install dependencies
RUN corepack enable && yarn install --immutable

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build the application
RUN yarn tsc --outDir build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Install only production dependencies
RUN corepack enable && yarn workspaces focus --production

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Expose MCP server port (if needed - adjust based on your server configuration)
EXPOSE 3000

# Start the MCP server
CMD ["node", "build/server.js"]
