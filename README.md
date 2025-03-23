# Claude MCP Think Tool

A Model Context Protocol (MCP) server that implements the "think" tool for Claude Desktop.

## Description

This tool allows Claude to use a structured space for thinking and reasoning step-by-step during complex problem-solving. The tool provides:

- Recording thoughts with timestamps
- Retrieving the sequence of thoughts
- Statistics about the thinking process
- Ability to clear the thinking session

## Installation

### Option 1: Install globally from npm (recommended)

```bash
npm install -g @cgize/mcp-think-tool
```

### Option 2: Install directly from GitHub

```bash
npm install -g github:cgize/claude-mcp-think-tool
```

### Option 3: Local installation (for development)

```bash
# Clone the repository
git clone https://github.com/cgize/claude-mcp-think-tool.git
cd claude-mcp-think-tool

# Install dependencies and build
npm install
npm run build

# Link globally
npm link
```

## Configuration with Claude Desktop

Add this configuration to your MCP configuration file:

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

The location of this file depends on your operating system:

- **Windows**: `%APPDATA%\Anthropic\Claude\mcp.json`
- **macOS**: `~/Library/Application Support/Anthropic/Claude/mcp.json`
- **Linux**: `~/.config/Anthropic/Claude/mcp.json`

## Usage

Once configured, you can use the thinking tool with Claude Desktop for problems that require step-by-step reasoning:

1. **Record a thought**: `think` - Saves a reasoning step
2. **View all thoughts**: `get_thoughts` - Shows the complete reasoning sequence
3. **Clear thoughts**: `clear_thoughts` - Deletes all saved thoughts
4. **Get statistics**: `get_thought_stats` - Shows statistics about your thinking process

## Example

Ask Claude to solve a complex problem using the think tool:

```
Solve this mathematical problem step by step using the think tool:
A train travels at a constant speed of 60 km/h. It departs from station A at 9:00 AM and arrives at station B at 11:30 AM. What is the distance between stations A and B?
```

## License

MIT
