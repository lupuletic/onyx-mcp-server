#!/usr/bin/env node
/**
 * Onyx MCP Server
 * Entry point for the Onyx MCP Server
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { OnyxMcpServer } from './server.js';

/**
 * Main function to start the server
 */
async function main() {
  try {
    const server = new OnyxMcpServer();
    const transport = new StdioServerTransport();
    await server.run(transport);
  } catch (error) {
    console.error('Failed to start Onyx MCP Server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(console.error);