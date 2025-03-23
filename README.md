# MCP Think Tool Server

A Model Context Protocol (MCP) server implementing the "think" tool for improving Claude's complex reasoning capabilities.

## Overview

This MCP server implements the "think" tool as described in Anthropic's [blog post](https://www.anthropic.com/engineering/claude-think-tool), which provides Claude with a dedicated space for structured thinking during complex problem-solving tasks. The think tool has been shown to significantly improve performance in complex tasks requiring policy adherence and reasoning in long chains of tool calls.

## Features

- **Structured Thinking Space**: Provides Claude with a dedicated place to break down complex problems
- **Thought History**: Maintains a log of all thoughts with timestamps for reference
- **Statistics and Analysis**: Offers metadata about thinking patterns
- **Clean Slate Option**: Allows clearing thought history when starting fresh

## Installation

Install from npm:

```bash
npm install -g @cgize/mcp-think-tool
```

## Configuration

To use this tool with Claude Desktop, add the following configuration to your MCP config file:

```json
{
  "mcpServers": {
    "think-tool": {
      "command": "npx",
      "args": [
        "-y",
        "@cgize/mcp-think-tool"
      ],
      "type": "stdio",
      "pollingInterval": 30000,
      "startupTimeout": 30000,
      "restartOnFailure": true
    }
  }
}
```

The location of this file depends on your operating system:

- **Windows**: `%APPDATA%\Anthropic\Claude\mcp.json`
- **macOS**: `~/Library/Application Support/Anthropic/Claude/mcp.json`
- **Linux**: `~/.config/Anthropic/Claude/mcp.json`

If you've installed the package globally using `npm install -g @cgize/mcp-think-tool`, you can also use:

```json
{
  "mcpServers": {
    "think-tool": {
      "command": "claude-mcp-think-tool",
      "args": [],
      "type": "stdio",
      "pollingInterval": 30000,
      "startupTimeout": 30000,
      "restartOnFailure": true
    }
  }
}
```

## Usage

Once configured, Claude will have access to these tools:

1. **think**: Record a structured thought or reasoning step
2. **get_thoughts**: Retrieve all thoughts recorded in the current session 
3. **clear_thoughts**: Clear all recorded thoughts to start fresh
4. **get_thought_stats**: Get statistics about the recorded thoughts

## Example

Ask Claude to solve a complex problem using the think tool:

```
Solve this mathematical problem step by step using the think tool:
A train travels at a constant speed of 60 km/h. It departs from station A at 9:00 AM and arrives at station B at 11:30 AM. What is the distance between stations A and B?
```

## Development

For those who want to contribute or modify the tool:

```bash
# Clone the repository
git clone https://github.com/cgize/claude-mcp-think-tool.git
cd claude-mcp-think-tool

# Install dependencies and build
npm install
npm run build
```

## License

MIT
