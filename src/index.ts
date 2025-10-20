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
      "Usage:\
Use 'think' to record reasoning steps in persistent sequence. Retrieve with 'get_thoughts' or 'get_thought_stats'. Sequence persists across sessions until 'clear_thoughts' called.\
ALWAYS append all current thoughts in one call to the tool, avoid calling the tool multiple times in a row with one thought each if you can.\
\
## Mandatory Use Triggers\
Call think before actions or responses when:\
- Tool results require validation against integrity rules (test changes, shortcuts, coverage)\
- Multi-step planning needed (≥3 sequential operations)\
- Policy compliance verification required\
- Complex information synthesis (web search results, codebase analysis)\
- Gap identification in requirements or evidence\
\
## Execution Protocol\
1. Clear thoughts at reasoning process start: 'clear_thoughts'\
2. Record each step: problem decomposition → constraint identification → approach evaluation → validation\
3. Structure thoughts as: [Rule/Constraint] → [Evidence] → [Decision] → [Next Action]\
4. Verify: shortcuts detected (yes/no), integrity maintained (yes/no), evidence complete (yes/no)\
5. Before finalizing: review sequence for logical consistency and policy adherence\
\
## Required Thought Content\
- Applicable rules from system hierarchy (specific section references)\
- Information completeness checklist (collected/missing)\
- Compliance verification (test integrity, API stability, truth requirements)\
- Alternative approaches ranked by correctness/effort\
- Detected conflicts between user request and system constraints",
      { thoughts: z.union([z.array(z.string()), z.string()]).describe("One or more thoughts to think about. Type: [array|json(array of strings)|string]. This can be structured reasoning, step-by-step analysis, policy verification, or any other mental process that helps with problem-solving.") },
      async ({ thoughts }) => {
        // Parse input into array of thoughts
        let thoughtsArray: string[];

        if (Array.isArray(thoughts)) {
          thoughtsArray = thoughts;
        } else {
          // Try to parse as JSON array
          try {
            const parsed = JSON.parse(thoughts);
            thoughtsArray = Array.isArray(parsed) ? parsed : [thoughts];
          } catch {
            // Fallback: treat as single thought
            thoughtsArray = [thoughts];
          }
        }

        // Log each thought with a timestamp
        const timestamp = new Date().toISOString();
        for (const t of thoughtsArray) {
          this.thoughtsLog.push({
            timestamp,
            thought: t
          });
        }

        console.error(`[${timestamp}] ${thoughtsArray.length} thought(s) recorded`);

        // Format feedback
        const thoughtPreviews = thoughtsArray.map(t =>
          `  - "${t.substring(0, 50)}${t.length > 50 ? '...' : ''}"`
        ).join('\n');

        const feedback = `${thoughtsArray.length} thought${thoughtsArray.length === 1 ? '' : 's'} recorded:\n${thoughtPreviews}`;

        return {
          content: [{
            type: "text",
            text: feedback
          }]
        };
      }
    );

    // Register the get_thoughts tool
    this.server.tool(
      "get_thoughts",
      "Retrieve all thoughts recorded in the current session to review your reasoning process.",
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
      "Clear all thoughts recorded in the current session. Use this to start fresh if the thinking process needs to be reset.",
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
      "Get statistics about the thoughts recorded in the current session to analyze your thinking process.",
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
