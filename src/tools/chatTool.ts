/**
 * Chat Tool Handler
 * Handles the chat_with_onyx tool requests
 */
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { OnyxApiService } from '../services/onyxApi.js';
import { ChatParams } from '../types/index.js';

/**
 * Handle the chat_with_onyx tool request
 * @param args The tool arguments
 * @param onyxApiService The Onyx API service
 * @returns The tool response
 */
export async function handleChatWithOnyx(args: unknown, onyxApiService: OnyxApiService) {
  try {
    if (typeof args !== 'object' || args === null) {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
    }

    const { 
      query, 
      personaId = 15, 
      documentSets = [],
      // Unused parameter removed: enableAutoDetectFilters
      chatSessionId = null 
    } = args as ChatParams;
    
    if (!query || typeof query !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Query is required');
    }

    // Variable to store the chat session ID (either existing or new)
    let sessionId = chatSessionId;
    
    // Step 1: Create a chat session if one doesn't exist
    if (!sessionId) {
      sessionId = await onyxApiService.createChatSession(personaId);
    } else {
      console.error(`Using existing chat session with ID: ${sessionId}`);
    }

    // Step 2: Send a message to the chat session
    const { answer, documents } = await onyxApiService.sendChatMessage(sessionId, query, documentSets);

    return {
      content: [
        {
          type: 'text',
          text: `${answer}\n\nSources:\n${documents.map(doc => 
            `- ${doc.semantic_identifier || 'Unknown'} (${doc.document_id || 'Unknown ID'})`).join('\n')}\n\n---\nChat Session ID: ${sessionId}`,
          metadata: {
            chat_session_id: sessionId
          }
        }
      ]
    };
  } catch (error) {
    console.error('Error in handleChatWithOnyx:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error chatting with Onyx: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
}