/**
 * Type definitions for the Onyx MCP Server
 */

/**
 * Onyx search result interface
 */
export interface OnyxSearchResult {
  document_id: string;
  chunk_ind: number;
  semantic_identifier: string;
  link?: string;
  blurb: string;
  source_type: string;
  score: number;
  match_highlights?: string[];
}

/**
 * Onyx document interface
 */
export interface OnyxDocument {
  document_id: string;
  semantic_identifier: string;
}

/**
 * Document information interface
 */
export interface DocumentInfo {
  num_chunks: number;
  num_tokens: number;
}

/**
 * Chunk information interface
 */
export interface ChunkInfo {
  content: string;
  num_tokens: number;
}

/**
 * Configuration for the Onyx server
 */
export interface OnyxConfig {
  apiUrl: string;
  apiToken: string;
}

/**
 * Search parameters interface
 */
export interface SearchParams {
  query: string;
  documentSets?: string[];
  maxResults?: number;
  chunksAbove?: number;
  chunksBelow?: number;
  retrieveFullDocuments?: boolean;
}

/**
 * Chat parameters interface
 */
export interface ChatParams {
  query: string;
  personaId?: number;
  documentSets?: string[];
  enableAutoDetectFilters?: boolean;
  chatSessionId?: string | null;
}

/**
 * Chat content response interface
 */
export interface ChatContentResponse {
  type: string;
  text: string;
  metadata?: {
    chat_session_id: string;
  };
}

/**
 * Tool schemas for MCP
 */
export const toolSchemas = {
  search_onyx: {
    name: 'search_onyx',
    description: 'Search the Onyx backend for relevant documents',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The topic to search for',
        },
        chunksAbove: {
          type: 'integer',
          description: 'Number of chunks to include above the matching chunk (default: 1)',
          default: 1
        },
        chunksBelow: {
          type: 'integer',
          description: 'Number of chunks to include below the matching chunk (default: 1)',
          default: 1
        },
        retrieveFullDocuments: {
          type: 'boolean',
          description: 'Whether to retrieve full documents instead of just matching chunks (default: false)',
          default: false
        },
        documentSets: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of document set names to search within (empty for all)',
        },
        maxResults: {
          type: 'integer',
          description: 'Maximum number of results to return (default: 5)',
          minimum: 1,
          maximum: 10,
        },
      },
      required: ['query'],
    },
  },
  chat_with_onyx: {
    name: 'chat_with_onyx',
    description: 'Chat with Onyx to get comprehensive answers',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The question to ask Onyx'
        },
        personaId: {
          type: 'integer',
          description: 'The ID of the persona to use (default: 15)',
          default: 15
        },
        chatSessionId: {
          type: 'string',
          description: 'Existing chat session ID to continue a conversation (optional)'
        },
        documentSets: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of document set names to search within (empty for all)'
        },
        enableAutoDetectFilters: {
          type: 'boolean',
          description: 'Whether to enable auto-detection of filters (default: true)',
          default: true
        }
      },
      required: ['query']
    }
  }
};