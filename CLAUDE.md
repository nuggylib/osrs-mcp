# Old School RuneScape MCP Server

## Project Overview
This is a Model Context Protocol (MCP) server that provides tools and resources for interacting with Old School RuneScape (OSRS) data, APIs, and game mechanics. The server enables LLMs to access game information, perform calculations, and assist with OSRS-related tasks through a standardized protocol.

## Technology Stack
- **Language**: TypeScript/Node.js
- **Protocol**: Model Context Protocol SDK
- **Deployment**: Docker container
- **Data Storage**: Redis/PostgreSQL for caching and persistence
- **APIs**: OSRS Wiki API, RuneLite API, community-maintained APIs

## Key Features
- Wiki Data Parsing
- Personalized Gameplay Guides
- Boss Fight Coaching

## Architecture Decisions

### Caching Strategy
- Use Redis for hot data (GE prices, frequently accessed items)
- PostgreSQL for historical data and complex queries
- In-memory cache for static game data
- Cache invalidation based on data update frequency

### MCP Tools Structure
Tools should be organized by domain:
- `osrs/wiki/*` - Wiki-related operations
- `osrs/gameplay/*` - Gameplay guide operations
- `osrs/boss_fights/*` - Boss fight operations

## Development Guidelines

### TypeScript Standards
- Use strict TypeScript configuration
- Define interfaces for all OSRS data types
- Use enums for game constants (skills, item categories, etc.)
- Implement proper error handling with typed errors

### Testing Requirements
- Unit tests for all calculators and data transformers
- Integration tests for API interactions
- Mock external APIs in tests
- Test caching behavior explicitly

### Docker Considerations
- Multi-stage build for optimized image size
- Environment-based configuration
- Health checks for all external dependencies
- Volume mounts for persistent data

## Data Sources
1. **OSRS Wiki API**: Primary source for game data (community-maintained)
2. **RuneLite API**: Plugin data and enhanced features
5. **User Uploads**: Boss fight videos, specifically

## Project Structure
```
osrs-mcp/
├── src/
│   ├── server.ts           # MCP server initialization
│   ├── tools/              # MCP tool implementations
│   ├── resources/          # MCP resource providers
│   ├── services/           # Business logic and API clients
│   ├── models/             # TypeScript interfaces and types
│   ├── cache/              # Caching layer implementation
│   └── utils/              # Helper functions
├── data/                   # Static game data files
├── docker/                 # Docker configuration
├── tests/                  # Test files
└── config/                 # Configuration files

```

## API Endpoints to Implement
- `/tools/osrs/wiki/search` - Search topic by name
- `/tools/osrs/wiki/detail` - Get detailed topic information
- `/tools/osrs/gameplay` - Player gameplay guides
- `/tools/osrs/boss_fights` - Boss fight transcriber and coach

## Performance Considerations
- Batch API requests where possible
- Implement request rate limiting
- Use connection pooling for database
- Compress cached data
- Implement circuit breakers for external APIs

## Security Guidelines
- Never store user credentials
- Validate all input data
- Sanitize data from external APIs
- Use environment variables for sensitive configuration
- Implement rate limiting per user/session

## Common Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build TypeScript
npm run test            # Run tests
npm run lint            # Run linter

# Docker
docker build -t osrs-mcp .
docker run -p 3000:3000 osrs-mcp

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed initial data
```

## Environment Variables
```
MCP_PORT=3000
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://localhost/osrs_mcp
OSRS_WIKI_USER_AGENT=osrs-mcp/1.0.0
RUNELITE_API_URL=
CACHE_TTL_SECONDS=300
```

## Error Handling
- Use typed errors for different failure scenarios
- Log errors with context (user, tool, parameters)
- Graceful degradation when cache/APIs unavailable
- Return meaningful error messages to MCP clients

## Community Integration Notes
Since OSRS lacks official APIs, this project relies on community efforts:
- **Web Scraping**: Implement respectful scraping with proper delays and user agents
- **Rate Limiting**: Respect community API rate limits
- **Attribution**: Always credit data sources appropriately
- **Fallbacks**: Multiple data sources for critical information

## Future Enhancements
- WebSocket support for real-time GE prices
- Machine learning for price predictions
- Plugin system for custom calculators
- Integration with more community tools (OSRS Wiki calculators, etc.)
