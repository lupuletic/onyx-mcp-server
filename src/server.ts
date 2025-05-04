/**
 * Onyx MCP Server
 * Main server class for the Onyx MCP Server
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { OnyxApiService } from './services/onyxApi.js';
import { loadConfig, SERVER_CONFIG } from './config/index.js';
import { handleSearchOnyx, handleChatWithOnyx } from './tools/index.js';
import { toolSchemas } from './types/index.js';

/**
 * OnyxMcpServer class
 * Main server class for the Onyx MCP Server
 */
export class OnyxMcpServer {
  private server: Server;
  private onyxApiService: OnyxApiService;
  private handlersSetup = false;

  /**
   * Constructor
   */
  constructor() {
    this.server = new Server(
      {
        name: SERVER_CONFIG.name,
        version: SERVER_CONFIG.version,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // Get configuration from environment variables
    const config = loadConfig();
    this.onyxApiService = new OnyxApiService(config);
    
    // Error handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.server.onerror = (error: any) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Get the Onyx API service instance
   * This allows other components to access the API service
   */
  getOnyxApiService(): OnyxApiService {
    return this.onyxApiService;
  }

  /**
   * Set up tool handlers
   * This should only be called once before connecting to any transport
   */
  private setupToolHandlers() {
    if (this.handlersSetup) {
      return; // Handlers already set up, don't do it again
    }
    
    // Handler for call_tool requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'search_onyx':
          return handleSearchOnyx(request.params.arguments, this.onyxApiService);
        case 'chat_with_onyx':
          return handleChatWithOnyx(request.params.arguments, this.onyxApiService);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
    
    // Handler for list_tools requests
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          toolSchemas.search_onyx,
          toolSchemas.chat_with_onyx,
        ],
      };
    });
    
    this.handlersSetup = true;
  }

  /**
   * Run the server with a specific transport
   * @param transport The server transport
   * @param transportName A friendly name for the transport (for logging)
   */
  // Using any for transport as the Transport type is not exported from the SDK
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async run(transport: any, transportName = 'default') {
    // Make sure handlers are set up before connecting
    this.setupToolHandlers();
    
    try {
      // Connect to the transport - this will register the SDK's internal handlers
      await this.server.connect(transport);
      
      // For testing purposes, if the transport has a setupForTest method, call it
      if (transport.setupForTest && typeof transport.setupForTest === 'function') {
        transport.setupForTest();
      }
      
      console.error(`Onyx MCP Server running on ${transportName} transport`);
      return true;
    } catch (error) {
      console.error(`Error starting Onyx MCP Server on ${transportName} transport:`, error);
      return false;
    }
  }
}