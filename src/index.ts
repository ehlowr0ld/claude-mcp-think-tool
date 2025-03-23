#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Interfaz para almacenar los pensamientos
interface ThoughtRecord {
  timestamp: string;
  thought: string;
}

class ThinkToolServer {
  private thoughtsLog: ThoughtRecord[] = [];
  private server: McpServer;

  constructor() {
    // Inicializar el servidor MCP
    this.server = new McpServer({
      name: "think-tool",
      version: "1.0.0"
    });
    
    // Registrar las herramientas
    this.registerTools();
  }

  private registerTools(): void {
    // Registrar la herramienta "think"
    this.server.tool(
      "think",
      "Usa esta herramienta para pensar sobre algo. No obtendrá nueva información ni cambiará nada, solo registrará el pensamiento.",
      { thought: z.string().describe("Un pensamiento para analizar o razonar") },
      async ({ thought }) => {
        // Registrar el pensamiento con marca de tiempo
        const timestamp = new Date().toISOString();
        this.thoughtsLog.push({
          timestamp,
          thought
        });
        
        console.error(`[${timestamp}] Thought recorded: ${thought.substring(0, 50)}${thought.length > 50 ? '...' : ''}`);
        
        // Retornar una confirmación
        return {
          content: [{ 
            type: "text", 
            text: `Thought recorded: ${thought.length > 50 ? thought.substring(0, 50) + '...' : thought}` 
          }]
        };
      }
    );

    // Registrar la herramienta get_thoughts
    this.server.tool(
      "get_thoughts",
      "Recupera todos los pensamientos grabados en la sesión actual.",
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

    // Registrar la herramienta clear_thoughts
    this.server.tool(
      "clear_thoughts",
      "Borra todos los pensamientos grabados en la sesión actual.",
      async () => {
        const count = this.thoughtsLog.length;
        this.thoughtsLog = [];
        
        return {
          content: [{ type: "text", text: `Cleared ${count} recorded thoughts.` }]
        };
      }
    );

    // Registrar la herramienta get_thought_stats
    this.server.tool(
      "get_thought_stats",
      "Obtiene estadísticas sobre los pensamientos registrados en la sesión actual.",
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

// Manejo de señales para cierre adecuado
process.on('SIGINT', () => {
  console.error("Shutting down Think Tool MCP Server...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error("Shutting down Think Tool MCP Server...");
  process.exit(0);
});

// Iniciar servidor
const server = new ThinkToolServer();
server.run().catch(err => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
