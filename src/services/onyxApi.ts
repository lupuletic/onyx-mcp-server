/**
 * Onyx API Service
 * Handles all interactions with the Onyx API
 */
import axios from 'axios';
import { OnyxConfig, OnyxSearchResult } from '../types/index.js';
import { DEBUG } from '../config/index.js';

/**
 * OnyxApiService class for interacting with the Onyx API
 */
export class OnyxApiService {
  private config: OnyxConfig;

  /**
   * Constructor
   * @param config The Onyx configuration
   */
  constructor(config: OnyxConfig) {
    this.config = config;
  }

  /**
   * Search Onyx for relevant documents
   * @param query The search query
   * @param documentSets Optional document sets to search within
   * @param chunksAbove Number of chunks to include above the matching chunk
   * @param chunksBelow Number of chunks to include below the matching chunk
   * @returns Array of search results
   */
  async searchOnyx(
    query: string,
    documentSets: string[] = [],
    chunksAbove = 0,
    chunksBelow = 0
  ): Promise<OnyxSearchResult[]> {
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/admin/search`,
        {
          query,
          filters: {
            document_set: documentSets.length > 0 ? documentSets : null,
            source_type: null,
            time_cutoff: null,
            tags: null
          },
          chunks_above: chunksAbove,
          chunks_below: chunksBelow,
          evaluation_type: 'basic' // Enable LLM relevance filtering
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiToken}`
          }
        }
      );

      return response.data.documents || [];
    } catch (error) {
      console.error('Error searching Onyx:', error);
      throw new Error(`Failed to search Onyx: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fetch a specific chunk from a document
   * @param documentId The document ID
   * @param chunkId The chunk ID
   * @returns The chunk content
   */
  async fetchDocumentChunk(documentId: string, chunkId: number): Promise<string> {
    try {
      const encodedDocId = encodeURIComponent(documentId);
      const response = await axios.get(
        `${this.config.apiUrl}/document/chunk-info?document_id=${encodedDocId}&chunk_id=${chunkId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`
          }
        }
      );

      return response.data.content || '';
    } catch (error) {
      console.error(`Error fetching chunk ${chunkId} for document ${documentId}:`, error);
      return '';
    }
  }

  /**
   * Fetch the full content of a document by retrieving all its chunks
   * @param documentId The document ID
   * @returns The full document content
   */
  async fetchDocumentContent(documentId: string): Promise<string> {
    try {
      const encodedDocId = encodeURIComponent(documentId);
      
      // First get document info to know how many chunks there are
      const infoResponse = await axios.get(
        `${this.config.apiUrl}/document/document-size-info?document_id=${encodedDocId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`
          }
        }
      );
      
      const numChunks = infoResponse.data.num_chunks;
      
      // Fetch all chunks and combine them
      let fullContent = '';
      for (let i = 0; i < numChunks; i++) {
        const chunkResponse = await axios.get(
          `${this.config.apiUrl}/document/chunk-info?document_id=${encodedDocId}&chunk_id=${i}`,
          {
            headers: {
              'Authorization': `Bearer ${this.config.apiToken}`
            }
          }
        );
        
        fullContent += chunkResponse.data.content + '\n\n';
      }
      
      return fullContent;
    } catch (error) {
      console.error(`Error fetching full content for document ${documentId}:`, error);
      return '';
    }
  }

  /**
   * Create a new chat session
   * @param personaId The persona ID to use
   * @returns The chat session ID
   */
  async createChatSession(personaId: number): Promise<string> {
    console.error(`Creating new chat session with persona_id: ${personaId}`);
    const createSessionUrl = `${this.config.apiUrl}/chat/create-chat-session`;
    console.error(`Sending request to: ${createSessionUrl}`);
    
    try {
      const chatSessionResponse = await axios.post<{ chat_session_id: string }>(
        createSessionUrl,
        {
          persona_id: personaId,
          description: 'API Test Chat'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiToken}`
          }
        }
      );

      if (DEBUG) {
        console.error(`Chat session response: ${JSON.stringify(chatSessionResponse.data)}`);
        console.error(`Response status: ${chatSessionResponse.status}`);
        console.error(`Response headers: ${JSON.stringify(chatSessionResponse.headers)}`);
      }
      
      const sessionId = chatSessionResponse.data.chat_session_id;
      console.error(`Chat session created with ID: ${sessionId}`);
      return sessionId;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw new Error(`Failed to create chat session: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Send a message to a chat session
   * @param sessionId The chat session ID
   * @param query The message to send
   * @param documentSets Optional document sets to search within
   * @returns The chat response
   */
  async sendChatMessage(sessionId: string, query: string, documentSets: string[] = []): Promise<{ answer: string, documents: any[] }> {
    const sendMessageUrl = `${this.config.apiUrl}/chat/send-message`;
    console.error(`Sending message to: ${sendMessageUrl}`);
    console.error(`With chat_session_id: ${sessionId}`);
    
    const messagePayload = {
      chat_session_id: sessionId,
      parent_message_id: null,
      message: query,
      search_doc_ids: [],
      file_descriptors: [],
      prompt_id: null,
      retrieval_options: {
        run_search: 'auto',
        real_time: true,
        filters: {
          document_set: documentSets.length > 0 ? documentSets : null,
          source_type: null,
          time_cutoff: null,
          tags: null
        }
      },
      regenerate: false
    };
    
    if (DEBUG) {
      console.error('=== DEBUG INFO ===');
      console.error(`API URL: ${this.config.apiUrl}`);
      console.error(`Send Message URL: ${sendMessageUrl}`);
      console.error(`Message Payload: ${JSON.stringify(messagePayload)}`);
    }
    
    try {
      const messageResponse = await axios.post<string>(
        sendMessageUrl,
        messagePayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiToken}`
          },
          responseType: 'text'
        }
      );

      // Get the response text
      const responseText = messageResponse.data;
      if (DEBUG) {
        console.error(`Response status: ${messageResponse.status}`);
        console.error(`Response headers: ${JSON.stringify(messageResponse.headers)}`);
        console.error(`Response text (first 200 chars): ${responseText.substring(0, 200)}...`);
      }
      
      // Initialize variables for answer and documents
      let answer = '';
      let documents: any[] = [];
      
      try {
        // First try parsing as a single JSON object
        const jsonResponse = JSON.parse(responseText);
        if (DEBUG) {
          console.error(`Parsed response as single JSON: ${Object.keys(jsonResponse).join(', ')}`);
        }
        
        if (jsonResponse.answer) {
          answer = jsonResponse.answer;
        }
        if (jsonResponse.documents || jsonResponse.top_documents) {
          documents = jsonResponse.documents || jsonResponse.top_documents || [];
        }
      } catch (e) {
        // If that fails, try parsing as JSON lines
        console.error(`Failed to parse as single JSON, trying JSON lines: ${e}`);
        const responseLines = responseText.split('\n').filter(line => line.trim());
        
        for (const line of responseLines) {
          try {
            const data = JSON.parse(line);
            if (DEBUG) {
              console.error(`Parsed line data type: ${Object.keys(data).join(', ')}`);
            }
            
            if (data.answer_piece) {
              answer += data.answer_piece;
            } else if (data.top_documents) {
              documents = data.top_documents;
            }
          } catch (e) {
            // Skip invalid JSON
            console.error(`Error parsing line: ${e}`);
          }
        }
      }
      
      return { answer, documents };
    } catch (error) {
      console.error('Error sending chat message:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('=== ERROR DETAILS ===');
        console.error(`Response status: ${error.response?.status}`);
        console.error(`Response data: ${JSON.stringify(error.response?.data)}`);
        
        if (DEBUG) {
          console.error(`Request URL: ${error.config?.url}`);
          console.error(`Request method: ${error.config?.method}`);
          console.error(`Request headers: ${JSON.stringify(error.config?.headers)}`);
          console.error(`Request data: ${JSON.stringify(error.config?.data)}`);
        }
      }
      throw new Error(`Error chatting with Onyx: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Build a comprehensive context from search results and content
   * @param results The search results
   * @param contents The content for each result
   * @returns Formatted context string
   */
  buildContext(results: OnyxSearchResult[], contents: string[]): string {
    let contextBuilder = '';

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const content = contents[i];

      if (!content) continue;

      // Add document metadata
      contextBuilder += `# ${result.semantic_identifier}\n`;
      contextBuilder += `Source: ${result.link || result.document_id}\n`;
      contextBuilder += `Relevance Score: ${result.score}\n\n`;
      
      // Add content
      contextBuilder += content;
      
      // Add separator
      contextBuilder += '\n\n---\n\n';
    }

    return contextBuilder;
  }
}