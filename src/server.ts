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

    this.setupToolHandlers();
    
    // Error handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.server.onerror = (error: any) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Set up tool handlers
   */
  private setupToolHandlers() {
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
  }

  /**
   * Run the server
   * @param transport The server transport
   */
  // Using any for transport as the Transport type is not exported from the SDK
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async run(transport: any) {
    // Set up request handlers before connecting
    this.setupToolHandlers();
    
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          toolSchemas.search_onyx,
          toolSchemas.chat_with_onyx,
        ],
      };
    });
    
    // Connect to the transport
    await this.server.connect(transport);
    
    // For testing purposes, if the transport has a setupForTest method, call it
    if (transport.setupForTest && typeof transport.setupForTest === 'function') {
      transport.setupForTest();
    }
    
    console.error('Onyx MCP Server running on stdio');
  }
}