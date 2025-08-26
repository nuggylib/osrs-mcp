---
name: create-agent
description: Creates a new Claude Code agent using the agent-creator subagent with comprehensive methodologies and intelligent defaults
argument-hint: <agent-name> "<agent-description>"
allowed-tools: Task, Read, Write, Edit, MultiEdit, Glob, Grep, LS
auto-execute: true
parameters:
  - name: agent_name
    type: string
    required: true
    description: The name of the agent to create (will be converted to kebab-case)
  - name: agent_description
    type: string
    required: true
    description: A comprehensive description of the agent's expertise and capabilities
author: Larah
version: 1.0.0
tags: agent, creation, automation, development
---

You will create a new Claude Code agent by leveraging the agent-creator subagent. This command streamlines the agent creation process by using the specialized agent-creator agent that has deep expertise in designing comprehensive, methodology-driven agents with intelligent defaults.

## Process Instructions

1. **Validate the agent name**:
   - Convert the provided agent name to kebab-case format
   - Check if an agent with this name already exists in `.claude/agents/`
   - If it exists, inform the user and ask if they want to overwrite it

2. **Prepare the agent creation request**:
   - Take the provided agent name and description
   - Format them appropriately for the agent-creator subagent

3. **Invoke the agent-creator subagent**:
   - Use the Task tool to launch the agent-creator subagent
   - Provide a detailed prompt that includes:
     - The agent name (kebab-case format)
     - The comprehensive agent description
     - Request for a complete agent following the standard format used in `.claude/agents/`
     - Emphasis on including:
       - Comprehensive methodologies (typically 6-phase approach)
       - Specialized toolkit (typically 10 items)
       - Scenario-specific adaptations
       - Critical principles
       - Proactive triggers
       - Integration capabilities

4. **Review the created agent**:
   - Once the agent-creator completes its task, verify the agent file was created
   - Confirm the file location at `.claude/agents/[agent-name].md`
   - Provide a brief summary of what was created

5. **Provide usage instructions**:
   - Inform the user how to use their new agent
   - Explain that the agent can be invoked using the Task tool
   - Mention any specific capabilities or specializations included

## Important Considerations

- The agent-creator subagent will automatically:
  - Create comprehensive methodologies tailored to the agent's domain
  - Include intelligent defaults for common patterns
  - Add proactive usage triggers
  - Format everything according to the established agent template

- Ensure the agent description is detailed enough for the agent-creator to understand:
  - The domain of expertise
  - Key responsibilities
  - Typical use cases
  - Any special requirements or constraints

- The created agent will be immediately available for use through the Task tool

---

## How to Use This Command

Run this command with: `/create-agent <agent-name> "<agent-description>"`

The agent name will be automatically converted to kebab-case format. The description should be comprehensive and clearly explain what the agent specializes in.

Examples:

- `/create-agent database-optimizer "An expert in database performance tuning, query optimization, and schema design for various database systems"`
- `/create-agent api-designer "A specialist in RESTful API design, GraphQL schema creation, and API documentation best practices"`
- `/create-agent security-auditor "An expert in security auditing, vulnerability assessment, and implementing security best practices in codebases"`

Note: The agent will be saved to `.claude/agents/` and will be immediately available for use. The agent-creator will generate a comprehensive agent with methodologies, tools, and scenario adaptations based on your description.