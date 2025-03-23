# MCP Think Tool Server

A Model Context Protocol (MCP) server implementing the ["think" tool](https://www.anthropic.com/engineering/claude-think-tool) for improving Claude's complex reasoning capabilities.

## Overview

This MCP server implements Anthropic's "think" tool, which provides Claude with a dedicated space for structured thinking during complex problem-solving tasks. As described in [Anthropic's blog post](https://www.anthropic.com/engineering/claude-think-tool), the think tool has been shown to significantly improve performance in complex tasks requiring policy adherence and reasoning in long chains of tool calls.

## Key Use Cases

- **Complex Tool Chains**: When Claude needs to call complex tools and analyze outputs carefully
- **Policy Adherence**: For navigating policy-heavy environments with detailed guidelines
- **Sequential Decision Making**: When each step builds on previous ones and mistakes are costly
- **Multi-step Analysis**: Breaking down complex problems into manageable steps

## Installation

```bash
npm install -g @cgize/mcp-think-tool
```

## Configuration

Add this configuration to your MCP configuration file:

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

File location by operating system:
- **Windows**: `%APPDATA%\Anthropic\Claude\mcp.json`
- **macOS**: `~/Library/Application Support/Anthropic/Claude/mcp.json`
- **Linux**: `~/.config/Anthropic/Claude/mcp.json`

If installed globally, you can also use:

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

## Available Tools

- **think**: Record structured reasoning during problem-solving
- **get_thoughts**: Retrieve all recorded thoughts 
- **clear_thoughts**: Reset the thinking process
- **get_thought_stats**: Analyze thinking patterns

## Example Prompt

```
Using the think tool, solve this multi-step problem:

A train travels at a constant speed of 60 km/h. It departs from station A at 9:00 AM and arrives at station B at 11:30 AM. What is the distance between stations A and B?
```

## License

MIT
