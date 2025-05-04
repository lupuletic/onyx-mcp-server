#!/usr/bin/env node
/**
 * Onyx MCP Server
 * Entry point for the Onyx MCP Server
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { OnyxMcpServer } from './server.js';
import { HttpDirectServer } from './server/httpDirectServer.js';
import { loadConfig } from './config/index.js';
import { handleSearchOnyx, handleChatWithOnyx } from './tools/index.js';
import { toolSchemas } from './types/index.js';

/**
 * Main function to start the server
 */
async function main() {
  try {
    const config = loadConfig();
    const server = new OnyxMcpServer();
    
    // Start with stdio transport for CLI usage
    const stdioTransport = new StdioServerTransport();
    await server.run(stdioTransport, 'stdio');
    
    // Start the HTTP server with a direct implementation
    const httpServer = new HttpDirectServer(config.httpPort);
    
    // Register the tool handlers directly
    httpServer.registerTool('search_onyx', (args) => handleSearchOnyx(args, server.getOnyxApiService()));
    httpServer.registerTool('chat_with_onyx', (args) => handleChatWithOnyx(args, server.getOnyxApiService()));
    
    // Start the HTTP server
    await httpServer.start();
    
    console.error(`Onyx MCP Server running on stdio and HTTP port ${config.httpPort}`);
  } catch (error) {
    console.error('Failed to start Onyx MCP Server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(console.error);