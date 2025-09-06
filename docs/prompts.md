# MCP Tool and Resource Prompt Best Practices

This document outlines best practices for writing and managing tool and resource descriptions in Model Context Protocol (MCP) servers, based on industry standards and official MCP documentation.

## Key Principles

### 1. Format: Plain Text Only

Tool and resource descriptions should be written as **plain text strings**, not markdown. While markdown might seem appealing for formatting, the MCP specification and industry best practices recommend plain text for maximum compatibility and proper rendering across different clients.

### 2. Comprehensive Yet Concise

Descriptions should be detailed enough to help language models understand when and how to use the tool, but concise enough to avoid unnecessary token usage. Include:

- Clear explanation of the tool's functionality
- When to use the tool
- Expected inputs and outputs
- Common use cases and examples
- Relationship to other tools in your server

### 3. File Organization

Store prompts in dedicated `prompts/` directories within their respective tool or resource directories. This keeps prompts close to their usage and makes maintenance easier:

```
src/
├── tools/
│   └── wiki/
│       ├── prompts/
│       │   ├── search.txt
│       │   └── summary.txt
│       └── searchWikiForPage.ts
└── resources/
    └── wiki/
        ├── prompts/
        │   └── items.txt
        └── itemPageInfoKeys.ts
```

## Implementation Pattern

### Loading Prompts

Use a utility function to load prompts from external files:

```typescript
import { loadPrompt } from '../../utils/promptLoader.js';

server.registerTool(
  'tool_name',
  {
    description: loadPrompt('[subDirName]',  '[fielName].txt'),
    inputSchema: {
      // ... schema definition
    }
  },
  async (params) => {
    // ... implementation
  }
);
```

### Prompt File Structure

Write prompts as continuous prose without markdown formatting. Structure the content logically:

```text
Primary purpose and when to use this tool. Key functionality explained clearly.

This tool performs specific operations including: detailed explanation of what the tool does, how it processes inputs, and what outputs to expect. Include any important limitations or prerequisites.

Examples of usage:
1. First example: input "example input" returns specific type of output
2. Second example: input "another example" returns different type of output
3. Third example: edge case or special scenario

Common use cases include specific scenarios, typical user questions, and situations where this tool is most appropriate.

Related tools: After using this tool, you might use other_tool for more details, or another_tool for different aspects. Only use ultimate_tool as a last resort when other tools don't provide sufficient information.
```

## Best Practices from Industry Leaders

Based on analysis of production MCP servers (including Notion, Anthropic's examples, and other industry implementations):

### 1. Tool Selection Guidance

Help the LLM choose the right tool by clearly explaining:
- The tool's unique capabilities
- How it differs from similar tools
- Prerequisites (e.g., "use after search_tool to get valid page names")
- When NOT to use the tool

### 2. Progressive Disclosure

Structure your tool suite to support progressive information retrieval:
- Search/discovery tools first
- Summary/overview tools next
- Detailed/specific tools for deep dives
- Full content tools as last resort

### 3. Error Handling Context

Include information about potential errors and how to handle them:
- What happens if inputs are invalid
- Common error scenarios
- Suggested recovery actions

## Testing and Validation

### Prompt Quality Checklist

- [ ] Description explains WHAT the tool does
- [ ] Description explains WHEN to use the tool
- [ ] Examples demonstrate common usage patterns
- [ ] Relationship to other tools is clear
- [ ] No markdown formatting in the description
- [ ] File uses `.txt` extension, not `.md`

## References and Resources

### Official MCP Documentation
- [MCP Tools Concept Guide](https://modelcontextprotocol.io/docs/concepts/tools) - Official guide on tool implementation
- [MCP Specification](https://modelcontextprotocol.io/specification/2024-11-05) - Complete protocol specification
- [TypeScript SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk) - Official TypeScript SDK with examples

### Best Practices Articles
- [Anthropic's Introduction to MCP](https://www.anthropic.com/news/model-context-protocol) - Original announcement with design principles
- [MCP Server Best Practices](https://www.docker.com/blog/mcp-server-best-practices/) - Docker's guide to MCP server implementation
- [Complete Guide to MCP](https://www.keywordsai.co/blog/introduction-to-mcp) - Comprehensive overview of MCP concepts

### Implementation Examples
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers) - Official collection of example servers
- [MCP Registry](https://github.com/modelcontextprotocol/registry) - Community-driven registry of MCP servers

## Template Variable Support

The prompt loader utility supports template variables for dynamic content:

```typescript
const description = loadPromptWithVariables(
  'search.txt',
  __dirname,
  { 
    maxResults: 10,
    dataSource: 'OSRS Wiki'
  }
);
```

In your prompt file:
```text
This tool searches the {{dataSource}} and returns up to {{maxResults}} results...
```

## Migration Guide

If you're migrating from inline descriptions to external prompt files:

1. Create `prompts/` directory in your tool/resource folder
2. Extract description to a `.txt` file
3. Import the `loadPrompt` utility
4. Replace inline description with `loadPrompt('filename.txt', __dirname)`
5. Test with `yarn build` to ensure everything compiles

## Conclusion

Following these best practices ensures your MCP server tools and resources are:
- Easily discoverable by language models
- Maintainable and version-controllable
- Consistent with industry standards
- Optimized for token efficiency

Remember: clear, comprehensive descriptions are crucial for effective tool usage by AI models. Invest time in writing good prompts—they're the interface between your tools and the language model.
