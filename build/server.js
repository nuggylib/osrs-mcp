"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const server = new index_js_1.Server({
    name: 'osrs-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'wiki_search',
                description: 'Search the OSRS Wiki for information on a topic',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'The search query for the OSRS Wiki',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'wiki_detail',
                description: 'Get detailed information about a specific OSRS Wiki topic',
                inputSchema: {
                    type: 'object',
                    properties: {
                        topic: {
                            type: 'string',
                            description: 'The specific topic to get details for',
                        },
                    },
                    required: ['topic'],
                },
            },
            {
                name: 'gameplay_guide',
                description: 'Get personalized gameplay guides for OSRS',
                inputSchema: {
                    type: 'object',
                    properties: {
                        skill: {
                            type: 'string',
                            description: 'The skill to get a guide for (e.g., Mining, Fishing, Combat)',
                        },
                        level: {
                            type: 'number',
                            description: 'Current skill level',
                        },
                        goal: {
                            type: 'string',
                            description: 'What the player wants to achieve',
                        },
                    },
                    required: ['skill'],
                },
            },
            {
                name: 'boss_fight_coach',
                description: 'Get boss fight strategies and coaching',
                inputSchema: {
                    type: 'object',
                    properties: {
                        boss_name: {
                            type: 'string',
                            description: 'Name of the boss (e.g., Vorkath, Zulrah, Corporeal Beast)',
                        },
                        combat_stats: {
                            type: 'object',
                            description: 'Player combat stats',
                            properties: {
                                attack: { type: 'number' },
                                strength: { type: 'number' },
                                defence: { type: 'number' },
                                ranged: { type: 'number' },
                                magic: { type: 'number' },
                                prayer: { type: 'number' },
                            },
                        },
                    },
                    required: ['boss_name'],
                },
            },
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case 'wiki_search':
            const query = args?.query;
            return {
                content: [
                    {
                        type: 'text',
                        text: `Searching OSRS Wiki for: "${query}"\n\nThis would connect to the OSRS Wiki API and return relevant results.\nExample results:\n- ${query} (item)\n- ${query} guide\n- ${query} strategies`,
                    },
                ],
            };
        case 'wiki_detail':
            const topic = args?.topic;
            return {
                content: [
                    {
                        type: 'text',
                        text: `Getting detailed information for: "${topic}"\n\nThis would fetch comprehensive data from the OSRS Wiki API including:\n- Item/NPC/Location details\n- Requirements\n- Strategies and tips\n- Related content`,
                    },
                ],
            };
        case 'gameplay_guide':
            const skill = args?.skill;
            const level = args?.level || 1;
            const goal = args?.goal || 'level up efficiently';
            return {
                content: [
                    {
                        type: 'text',
                        text: `Generating ${skill} guide:\n\nCurrent Level: ${level}\nGoal: ${goal}\n\nRecommended activities:\n- Training methods appropriate for level ${level}\n- Optimal XP rates\n- Cost analysis\n- Equipment recommendations`,
                    },
                ],
            };
        case 'boss_fight_coach':
            const bossName = args?.boss_name;
            args?.combat_stats;
            return {
                content: [
                    {
                        type: 'text',
                        text: `Boss Fight Guide: ${bossName}\n\nAnalyzing combat stats...\n\nRecommendations:\n- Gear setup for your stats\n- Inventory setup\n- Prayer rotation\n- Attack patterns to watch for\n- Safe spots and positioning\n- Expected kills per hour`,
                    },
                ],
            };
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
});
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'osrs://wiki/recent',
                name: 'Recent Wiki Updates',
                description: 'Recently updated OSRS Wiki articles',
                mimeType: 'text/plain',
            },
            {
                uri: 'osrs://prices/ge',
                name: 'Grand Exchange Prices',
                description: 'Current Grand Exchange market prices',
                mimeType: 'application/json',
            },
        ],
    };
});
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    switch (uri) {
        case 'osrs://wiki/recent':
            return {
                contents: [
                    {
                        uri,
                        mimeType: 'text/plain',
                        text: 'Recent OSRS Wiki Updates:\n1. Varlamore expansion details\n2. New boss mechanics guide\n3. Updated skill training methods\n4. Item drop rate changes',
                    },
                ],
            };
        case 'osrs://prices/ge':
            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify({
                            items: [
                                { name: 'Twisted bow', price: 1234567890 },
                                { name: 'Scythe of vitur', price: 987654321 },
                                { name: 'Elysian spirit shield', price: 456789012 },
                            ],
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
            };
        default:
            throw new Error(`Unknown resource: ${uri}`);
    }
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('OSRS MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map