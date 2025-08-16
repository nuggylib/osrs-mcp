import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getInformationOnTopic } from './tools/wiki/getInformationOnTopic';

const server = new McpServer({
  name: 'osrs-mcp',
  version: '0.0.1',
  capabilities: {
    resources: {},
    tools: {}
  }
})

server.tool(
  'ask_wiki_about_topic',
  'Use whenever the user asks about an Old School RuneScape topic, or if the agent needs to gain further context on a topic to improve a response. Always defer to using the information from the wiki instead of potentially-outdated training data.',
  {
    topic: z.string().describe('The specific Old School RuneScape topic to ask the wiki about.')
  },
  async ({ topic }) => {
    console.error("[ask_wiki_about_topic] searching for topic: ", topic);
    return getInformationOnTopic(topic)
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OSRS MCP Server Running")
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});