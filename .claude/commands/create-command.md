---
name: create-command
description: Create a new Claude Code Command and save it to the specified location or default commands directory.
argument-hint: <task-description> [--location <path>]
allowed-tools: Write, Read, Edit, Bash, Task, WebFetch, WebSearch, Grep, Glob, MultiEdit, View, LS
auto-execute: true
thinking-mode: ultrathink
clear-before: false
parameters:
  - name: location
    type: string
    required: false
    default: .claude/commands/
    description: Directory path where the command file should be saved
author: Larah
version: 1.1.0
tags: tooling, automation, command-creation
---

You are Claude Code. You will create a fully functional Claude Code Command from the user's task description by following these explicit instructions. Transform the task description into a properly formatted command file and save it to the specified location or the default commands directory.

## Step 1: Analyze task description

Thoroughly analyze the user's task description to extract all available information. Mine the description for clues about tool needs, execution preferences, and command structure.

**Purpose**: Extract maximum information from the task description to minimize follow-up questions.

**Instructions**:

1. Read the complete task description carefully.
2. Extract explicit information:
   - Primary actions the command must perform.
   - Any mentioned tools or operations (file manipulation, web searches, system commands).
   - Specified output formats or destinations.
   - Mentioned constraints or preferences.
3. Infer implicit information:
   - IF the task mentions "files" or "directories": Assume Read, Write, MultiEdit, Edit tools needed.
   - IF the task mentions "search" or "find": Assume Grep, Glob, WebSearch, WebFetch tools needed.
   - IF the task mentions "automate" or "workflow": Consider auto-execute: true.
   - IF the task seems complex or multi-step: Consider including Task tool.
   - IF the task mentions "analysis" or "research": Consider thinking-mode: ultrathink.
4. Note any gaps where you'll need to use best judgment.
5. If a task is important or critical, use qualifiers like "IMPORTANT" or "CRITICAL" to indicate the importance of the task.
6. Note any areas where you can use another command in `.claude/commands/` as a sub-command.
7. Note any areas where you can use one of the available sub agents in `.claude/agents/` as a sub-agent.

**Expected Output**:
Comprehensive understanding of: main objective, required actions, tool needs, execution preferences, inputs/outputs, and constraints.

## Step 2: Generate command metadata

Create the command's identity based on your task analysis. Generate appropriate names and descriptions without asking the user.

**Purpose**: Define the command's identity and basic properties.

**Instructions**:

1. Generate a descriptive name in kebab-case that clearly indicates the command's function:
   - Extract key verbs and nouns from the task description.
   - Combine them logically (e.g., `analyze-codebase`, `generate-tests`, `create-documentation`).
2. Write a brief description by summarizing the task's main purpose in one clear sentence.
3. Determine if arguments are needed:
   - IF the task mentions variable inputs (filenames, paths, options): Create an argument hint.
   - IF the task is always the same: No argument hint needed.

**Expected Output**:

- name: kebab-case command name
- description: Brief, clear description
- argument-hint: Usage pattern (only if needed)

## Step 3: Determine required frontmatter fields

Use your task analysis to select appropriate frontmatter fields. Make intelligent defaults based on the task requirements.

**Purpose**: Configure the command with appropriate permissions and settings.

**Instructions**:

1. Set tool permissions based on your analysis:
   - Start with the default: `Bash(git:*), Bash(npm:test), Bash(cd*), Bash(mkdir*), Bash(find*), Bash(grep*) Edit, Read, Bash, Write, MultiEdit, View, Grep, Glob, Task, WebFetch, WebSearch`
   - Remove tools that definitely won't be needed.
   - Keep all tools if uncertain.
2. Configure execution settings:
   - auto-execute: Set true if the task is safe and deterministic, false if it modifies important files.
   - thinking-mode: Set "deep" for complex analysis tasks, omit for simple tasks.
   - max-turns: Set only if the task has a clear iteration limit.
3. Set context control:
   - include-context: Set true if the command builds on conversation, omit otherwise.
   - clear-before: Set true if the command needs a fresh start, omit otherwise.
4. Determine if parameters are needed:
   - Extract any configurable aspects from the task description.
   - Create parameters for values that might change between uses.

**Expected Output**:
Complete list of frontmatter fields with appropriate values.

## Step 4: Write process instructions

Create detailed, comprehensive instructions that will guide future AI execution of this command. Write from the perspective of instructing an AI agent. Assume the agent is a human and write in a way that is easy to understand and follow. Assume the agent has little to no knowledge of the command or the task.

**Purpose**: Comprehensively define the exact, precise, detailed steps for command execution.

**Instructions**:

1. Write an introductory paragraph that explains:
   - What the command accomplishes.
   - The general approach it will take.
   - Any important context or assumptions.
2. Break down the task into clear, detailed, sequential steps:
   - Use imperative language ("Read the file", "Analyze the content").
   - Number each major step.
   - Include specific tool usage where appropriate.
   - Include specific file paths, directories, and conventions where appropriate.
3. For each step, specify:
   - The action to perform.
   - Any conditions or decision points.
   - Expected outcomes or outputs.
   - How to handle common variations.
   - If the step is complex, break it down into smaller, more detailed steps.
4. Use natural language that both humans and AI can understand.
5. Include scenario-specific instructions where appropriate.

**Expected Output**:
Complete process instructions that comprehensively guide command execution. All instructions should be detailed, specific, and actionable. All instructions should be complete sentences.

## Step 5: Determine save location

Identify where to save the command file based on the provided location parameter or use the default location.

**Purpose**: Ensure the command is saved to the correct directory with proper validation.

**Instructions**:

1. Check if a location parameter was provided:
   - IF location parameter exists: Use the provided path.
   - IF no location parameter: Use default `.claude/commands/`.
2. Validate the target directory:
   - Use LS tool to verify the directory exists.
   - IF directory doesn't exist: Create it using Bash mkdir command.
   - Ensure write permissions are available.
3. Construct the full file path:
   - Combine the directory path with `[command-name].md`.
   - Ensure proper path formatting (no double slashes).

**Expected Output**:
Valid file path where the command will be saved.

## Step 6: Create and save command file

Assemble all components into a properly formatted command file. Follow the template rules exactly.

**Purpose**: Generate and save the complete command file.

**Instructions**:

1. Apply these template rules strictly:
   - Remove ALL comments from the template.
   - Remove ALL square brackets after filling values.
   - Include ONLY the frontmatter fields you need. If the user doesn't specify frontmatter, use your best judgment to determine which fields are needed.
   - No blank lines within the frontmatter section.
   - Always include: name, description, and allowed-tools.
   - Use complete sentences for all text fields.

2. Construct the file using this structure:

```markdown
---
name: [your-command-name]
description: [Your brief description]
argument-hint: [usage hint if needed]
allowed-tools: Bash(git:*), Bash(npm:test), Bash(cd*), Bash(mkdir*), Bash(find*), Bash(grep*) Edit, Read, Bash, Write, MultiEdit, View, Grep, Glob, Task, WebFetch, WebSearch
auto-execute: [true/false if needed]
max-turns: [number if needed]
thinking-mode: [deep/ultrathink if needed]
include-context: [true/false if needed]
clear-before: [true/false if needed]
compact-after: [true/false if needed]
output-format: [format if needed]
silent-mode: [true/false if needed]
requires-mcp: [mcp-server names if needed]
requires-files: [required files if needed]
parameters:
  - name: [param_name]
    type: [type]
    required: [true/false]
    default: [value if applicable]
    description: [description]
pre-hook: [command if needed]
post-hook: [command if needed]
author: Larah
version: 1.0.0
tags: [relevant, tags, here]
---

[Your process instructions here]
```

3. Create the filename: `[command-name].md`
4. Write the file to the path determined in Step 5

**Expected Output**:
A properly formatted command file saved to the filesystem.

## Step 7: Generate user instructions

Append clear usage instructions to the command file. These help users understand how to invoke and use the command effectively.

**Purpose**: Provide users with clear usage guidance.

**Instructions**:

1. Add a clear section separator:

   ```markdown

   ---

   ## How to Use This Command
   ```

2. Write usage instructions that include:
   - Basic usage: `Run this command with: /[command-name]`
   - IF arguments exist: Show the format with examples:

     ```
     /[command-name] <required-arg> [optional-arg]

     Examples:
     /[command-name] file.txt
     /[command-name] file.txt --verbose
     ```

   - IF parameters exist: Explain how to set them.
   - IF specific files are required: List them with paths.
   - IF MCP servers are required: Specify which ones must be running.
3. Add 2-3 practical examples showing real use cases.
4. Include any important notes or warnings.

**Expected Output**:
Complete user instructions appended to the command file.

---

## How to Use This Command

Run this command with: `/create-command <task-description> [--location <path>]`

This command takes a description of what you want your new command to do and generates a complete Claude Code Command file for it. You can optionally specify where to save the command file.

Examples:

- `/create-command "Create a command that analyzes Python code complexity"`
- `/create-command "Build a command to generate unit tests for JavaScript files" --location /my/custom/commands/`
- `/create-command "Make a command that searches for TODO comments across a codebase"`

By default, the generated command will be saved to `.claude/commands/` and will be immediately available for use. If you specify a custom location with `--location`, the command will be saved there instead.

Note: The specified directory must exist or will be created if possible. Ensure you have write permissions to the target location.
