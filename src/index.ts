#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Interface for storing thoughts
interface ThoughtRecord {
  timestamp: string;
  thought: string;
}

class ThinkToolServer {
  private thoughtsLog: ThoughtRecord[] = [];
  private server: McpServer;

  constructor() {
    // Initialize MCP server
    this.server = new McpServer({
      name: "think-tool",
      version: "1.0.0"
    });
    
    // Register tools
    this.registerTools();
  }

  private registerTools(): void {
    // Register the "think" tool
    this.server.tool(
      "think",
      "Use this tool to think about something. It will not obtain new information or change anything, but just append the thought to the log.",
      { thought: z.string().describe("A thought to analyze or reason about") },
      async ({ thought }) => {
        // Log the thought with a timestamp
        const timestamp = new Date().toISOString();
        this.thoughtsLog.push({
          timestamp,
          thought
        });
        
        console.error(`[${timestamp}] Thought recorded: ${thought.substring(0, 50)}${thought.length > 50 ? '...' : ''}`);
        
        // Return a confirmation
        return {
          content: [{ 
            type: "text", 
            text: `Thought recorded: ${thought.length > 50 ? thought.substring(0, 50) + '...' : thought}` 
          }]
        };
      }
    );

    // Register the get_thoughts tool
    this.server.tool(
      "get_thoughts",
      "Retrieve all thoughts recorded in the current session.",
      async () => {
        if (this.thoughtsLog.length === 0) {
          return {
            content: [{ type: "text", text: "No thoughts have been recorded yet." }]
          };
        }
        
        const formattedThoughts = this.thoughtsLog.map((entry, index) => 
          `Thought #${index + 1} (${entry.timestamp}):\n${entry.thought}\n`
        );
        
        return {
          content: [{ type: "text", text: formattedThoughts.join("\n") }]
        };
      }
    );

    // Register the clear_thoughts tool
    this.server.tool(
      "clear_thoughts",
      "Clear all thoughts recorded in the current session.",
      async () => {
        const count = this.thoughtsLog.length;
        this.thoughtsLog = [];
        
        return {
          content: [{ type: "text", text: `Cleared ${count} recorded thoughts.` }]
        };
      }
    );

    // Register the get_thought_stats tool
    this.server.tool(
      "get_thought_stats",
      "Get statistics about the thoughts recorded in the current session.",
      async () => {
        if (this.thoughtsLog.length === 0) {
          return {
            content: [{ type: "text", text: "No thoughts have been recorded yet." }]
          };
        }
        
        const totalThoughts = this.thoughtsLog.length;
        const avgLength = this.thoughtsLog.reduce((sum, entry) => sum + entry.thought.length, 0) / totalThoughts;
        
        let longestThoughtIndex = 0;
        let longestThoughtLength = 0;
        
        this.thoughtsLog.forEach((entry, index) => {
          if (entry.thought.length > longestThoughtLength) {
            longestThoughtLength = entry.thought.length;
            longestThoughtIndex = index;
          }
        });
        
        const stats = {
          total_thoughts: totalThoughts,
          average_length: Math.round(avgLength * 100) / 100,
          longest_thought_index: longestThoughtIndex + 1,
          longest_thought_length: longestThoughtLength
        };
        
        return {
          content: [{ type: "text", text: JSON.stringify(stats, null, 2) }]
        };
      }
    );
  }

  async run(transport = 'stdio'): Promise<void> {
    console.error(`Starting Think Tool MCP Server with ${transport} transport...`);
    
    try {
      const transportHandler = new StdioServerTransport();
      await this.server.connect(transportHandler);
      console.error("Think Tool MCP Server running on stdio");
    } catch (error) {
      console.error("Error starting server:", error);
      process.exit(1);
    }
  }
}

// Signal handling for graceful shutdown
process.on('SIGINT', () => {
  console.error("Shutting down Think Tool MCP Server...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error("Shutting down Think Tool MCP Server...");
  process.exit(0);
});

// Start server
const server = new ThinkToolServer();
server.run().catch(err => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
