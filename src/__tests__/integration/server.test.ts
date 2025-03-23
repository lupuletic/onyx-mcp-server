/**
 * Integration tests for the Onyx MCP Server
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { OnyxMcpServer } from '../../server.js';
import nock from 'nock';

// Mock transport for testing
class MockTransport {
  private onMessage: ((message: string) => void) | null = null;
  private connected = false;

  async connect(onMessage: (message: string) => void): Promise<void> {
    this.onMessage = onMessage;
    this.connected = true;
  }

  // Add start method to fix the error
  async start(): Promise<void> {
    // This method is required by the MCP SDK
    return Promise.resolve();
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.onMessage = null;
  }

  async send(message: string): Promise<void> {
    if (!this.connected || !this.onMessage) {
      throw new Error('Not connected');
    }
    // Simulate response based on the request
    const request = JSON.parse(message);
    let response;

    if (request.method === 'mcp.listTools') {
      response = {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          tools: [
            {
              name: 'search_onyx',
              description: expect.any(String),
              inputSchema: expect.any(Object),
            },
            {
              name: 'chat_with_onyx',
              description: expect.any(String),
              inputSchema: expect.any(Object),
            },
          ],
        },
      };
    } else if (request.method === 'mcp.callTool') {
      // Mock response for tool calls
      if (request.params.name === 'search_onyx') {
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: 'Mock search results',
              },
            ],
          },
        };
      } else if (request.params.name === 'chat_with_onyx') {
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: 'Mock chat response',
                metadata: {
                  chat_session_id: 'mock-session-id',
                },
              },
            ],
          },
        };
      }
    }

    if (response) {
      this.onMessage(JSON.stringify(response));
    }
  }
}

describe('OnyxMcpServer Integration', () => {
  let server: OnyxMcpServer;
  let transport: MockTransport;

  beforeEach(() => {
    // Set up environment variables
    process.env.ONYX_API_TOKEN = 'test-token';
    process.env.ONYX_API_URL = 'http://test-api.com/api';

    // Mock all HTTP requests
    nock.disableNetConnect();
    
    // Create server and transport
    server = new OnyxMcpServer();
    transport = new MockTransport();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
    delete process.env.ONYX_API_TOKEN;
    delete process.env.ONYX_API_URL;
  });

  it('should initialize and run the server', async () => {
    // Run the server with the mock transport
    await server.run(transport);
    
    // Verify that the server is running (no errors thrown)
    expect(true).toBe(true);
  });

  // Add more integration tests as needed
});