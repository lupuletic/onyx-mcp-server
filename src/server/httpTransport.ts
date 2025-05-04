/**
 * HTTP Transport implementation for the MCP server
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DEBUG } from '../config/index.js';
import { Request, Response } from 'express';

/**
 * HTTP Server Transport class for MCP
 * Implements the expected interface for MCP transports
 */
export class HttpServerTransport {
  private app = express();
  private port: number;
  private requestListener: ((message: string) => Promise<string>) | null = null;
  private errorHandler: ((error: Error) => void) | null = null;
  private server: any = null;

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

    // Setup routes
    this.app.post('/mcp', async (req: Request, res: Response) => {
      try {
        if (!this.requestListener) {
          throw new Error('No request listener registered');
        }

        const message = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        
        if (DEBUG) {
          console.error(`[HTTP] Received request: ${message}`);
        }
        
        const response = await this.requestListener(message);
        
        if (DEBUG) {
          console.error(`[HTTP] Sending response: ${response}`);
        }
        
        res.contentType('application/json');
        res.send(response);
      } catch (error) {
        console.error('[HTTP] Error processing request:', error);
        if (this.errorHandler && error instanceof Error) {
          this.errorHandler(error);
        }
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    });

    // Health check endpoint
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({ status: 'ok' });
    });
  }

  /**
   * Start the HTTP server - this is the method expected by the MCP SDK
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
   * Connect method (alias for start for backward compatibility)
   * @returns A promise that resolves when the server is ready
   */
  async connect(): Promise<void> {
    return this.start();
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

  /**
   * Set the request listener
   * @param listener The listener function that processes incoming requests
   */
  setRequestListener(listener: (message: string) => Promise<string>): void {
    this.requestListener = listener;
  }

  /**
   * Set the error handler
   * @param handler The handler function for errors
   */
  setErrorListener(handler: (error: Error) => void): void {
    this.errorHandler = handler;
  }

  /**
   * Send a message (not used for server implementation)
   * @param _message The message to send
   */
  async sendMessage(_message: string): Promise<void> {
    // Not used for server implementation
  }
}