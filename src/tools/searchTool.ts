/**
 * Search Tool Handler
 * Handles the search_onyx tool requests
 */
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { OnyxApiService } from '../services/onyxApi.js';
import { SearchParams } from '../types/index.js';

/**
 * Handle the search_onyx tool request
 * @param args The tool arguments
 * @param onyxApiService The Onyx API service
 * @returns The tool response
 */
export async function handleSearchOnyx(args: any, onyxApiService: OnyxApiService) {
  try {
    if (typeof args !== 'object' || args === null) {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
    }

    const { 
      query, 
      documentSets = [], 
      maxResults = 5,
      chunksAbove = 1,
      chunksBelow = 1,
      retrieveFullDocuments = false
    } = args as SearchParams;
    
    if (!query || typeof query !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'Query is required');
    }

    // Step 1: Perform semantic search to find relevant documents
    const searchResults = await onyxApiService.searchOnyx(query, documentSets, chunksAbove, chunksBelow);
    
    // Step 2: Get the most relevant results
    const relevantResults = searchResults
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
    
    // Step 3: For each relevant document, fetch either the specific chunk or full document content
    const relevantContent = await Promise.all(
      relevantResults.map(result => 
        retrieveFullDocuments 
          ? onyxApiService.fetchDocumentContent(result.document_id)
          : onyxApiService.fetchDocumentChunk(result.document_id, result.chunk_ind)
      )
    );
    
    // Step 4: Combine into comprehensive context
    const context = onyxApiService.buildContext(relevantResults, relevantContent);

    return {
      content: [
        {
          type: 'text',
          text: context,
        },
      ],
    };
  } catch (error) {
    console.error('Error in handleSearchOnyx:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error searching Onyx: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}