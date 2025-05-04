/**
 * HTTP Transport implementation for the MCP server that directly processes requests
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DEBUG } from '../config/index.js';
import { Request, Response } from 'express';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

/**
 * Direct HTTP Server for MCP protocol
 * This implementation bypasses the Transport interface and directly processes MCP requests
 */
export class HttpDirectServer {
  private app = express();
  private port: number;
  private server: any = null;
  private toolHandlers: Map<string, (params: any) => Promise<any>> = new Map();
  
  /**
   * Constructor
   * @param port The port to listen on
   */
  constructor(port: number) {
    this.port = port;

    // Configure Express
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.text());

    // Setup main MCP endpoint
    this.app.post('/mcp', async (req: Request, res: Response) => {
      try {
        if (DEBUG) {
          console.error(`[HTTP] Received request: ${JSON.stringify(req.body)}`);
        }
        
        // Parse and validate JSON-RPC request
        const jsonRpc = req.body;
        if (!jsonRpc || typeof jsonRpc !== 'object') {
          throw new McpError(ErrorCode.InvalidParams, 'Invalid JSON-RPC request');
        }
        
        const { id, method, params } = jsonRpc;
        if (!id || !method) {
          throw new McpError(ErrorCode.InvalidParams, 'Missing required JSON-RPC fields');
        }
        
        // Process the request based on the method
        let result;
        if (method === 'list_tools') {
          // Handle list_tools request
          result = await this.handleListTools();
        } else if (method === 'call_tool') {
          // Handle call_tool request
          if (!params || !params.name) {
            throw new McpError(ErrorCode.InvalidParams, 'Tool name is required');
          }
          
          const handler = this.toolHandlers.get(params.name);
          if (!handler) {
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${params.name}`);
          }
          
          result = await handler(params.arguments || {});
        } else {
          throw new McpError(ErrorCode.MethodNotFound, `Unknown method: ${method}`);
        }
        
        // Build JSON-RPC response
        const response = {
          jsonrpc: '2.0',
          id,
          result
        };
        
        if (DEBUG) {
          console.error(`[HTTP] Sending response: ${JSON.stringify(response)}`);
        }
        
        res.contentType('application/json');
        res.send(response);
      } catch (error) {
        console.error('[HTTP] Error processing request:', error);
        
        // Create error response in JSON-RPC format
        const errorResponse = {
          jsonrpc: '2.0',
          id: req.body?.id || null,
          error: {
            code: error instanceof McpError ? error.code : ErrorCode.InternalError,
            message: error instanceof Error ? error.message : String(error)
          }
        };
        
        res.status(error instanceof McpError ? 400 : 500)
           .contentType('application/json')
           .send(errorResponse);
      }
    });

    // Health check endpoint
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({ status: 'ok' });
    });
  }

  /**
   * Register a tool handler
   * @param name Tool name
   * @param handler Function to handle tool requests
   */
  registerTool(name: string, handler: (params: any) => Promise<any>): void {
    this.toolHandlers.set(name, handler);
    console.error(`[HTTP] Registered tool: ${name}`);
  }
  
  /**
   * Handle list_tools requests
   */
  async handleListTools(): Promise<{ tools: any[] }> {
    // Import tool schemas from the types definition
    const { toolSchemas } = await import('../types/index.js');
    
    // Get all registered tool schemas
    const tools = [];
    
    for (const name of this.toolHandlers.keys()) {
      if (name === 'search_onyx' && toolSchemas.search_onyx) {
        tools.push(toolSchemas.search_onyx);
      } else if (name === 'chat_with_onyx' && toolSchemas.chat_with_onyx) {
        tools.push(toolSchemas.chat_with_onyx);
      }
    }
    
    return { tools };
  }

  /**
   * Start the HTTP server
   * @returns A promise that resolves when the server is ready
   */
  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.error(`HTTP MCP Server listening on port ${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Close the HTTP server
   */
  async close(): Promise<void> {
    if (this.server) {
      return new Promise((resolve, reject) => {
        this.server.close((err: Error) => {
          if (err) {
            console.error('Error closing HTTP server:', err);
            reject(err);
          } else {
            console.error('HTTP MCP Server shutdown complete');
            resolve();
          }
        });
      });
    } else {
      console.error('HTTP MCP Server shutting down (no server instance)');
      return Promise.resolve();
    }
  }
}