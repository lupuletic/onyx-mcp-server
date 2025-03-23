/**
 * Unit tests for the tool handlers
 */
import { handleChatWithOnyx } from '../../tools/chatTool.js';
import { handleSearchOnyx } from '../../tools/searchTool.js';
import { OnyxApiService } from '../../services/onyxApi.js';
import { OnyxSearchResult } from '../../types/index.js';

describe('Tool Handlers', () => {
  let mockOnyxApiService: OnyxApiService;

  beforeEach(() => {
    // Create a mock instance of OnyxApiService
    mockOnyxApiService = new OnyxApiService({
      apiUrl: 'http://test-api.com/api',
      apiToken: 'test-token',
    });
  });

  describe('handleChatWithOnyx', () => {
    beforeEach(() => {
      // Set up the mock implementations
      mockOnyxApiService.createChatSession = jest.fn().mockImplementation(() => {
        return Promise.resolve('test-session-id');
      });
      
      mockOnyxApiService.sendChatMessage = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          answer: 'Test answer',
          documents: [
            { document_id: 'doc1', semantic_identifier: 'Test Document 1' },
            { document_id: 'doc2', semantic_identifier: 'Test Document 2' },
          ],
        });
      });
    });

    it('should throw an error for invalid arguments', async () => {
      // Test with null arguments
      const result1 = await handleChatWithOnyx(null, mockOnyxApiService);
      expect(result1.isError).toBe(true);
      expect(result1.content[0].text).toContain('Invalid arguments');

      // Test with non-object arguments
      const result2 = await handleChatWithOnyx('not an object', mockOnyxApiService);
      expect(result2.isError).toBe(true);
      expect(result2.content[0].text).toContain('Invalid arguments');
    });

    it('should throw an error for missing query', async () => {
      const result = await handleChatWithOnyx({ personaId: 15 }, mockOnyxApiService);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Query is required');
    });

    it('should create a new chat session when chatSessionId is not provided', async () => {
      await handleChatWithOnyx({ query: 'test query' }, mockOnyxApiService);
      expect(mockOnyxApiService.createChatSession).toHaveBeenCalledWith(15); // Default personaId
    });

    it('should use existing chat session when chatSessionId is provided', async () => {
      await handleChatWithOnyx(
        { query: 'test query', chatSessionId: 'existing-session' },
        mockOnyxApiService
      );
      expect(mockOnyxApiService.createChatSession).not.toHaveBeenCalled();
      expect(mockOnyxApiService.sendChatMessage).toHaveBeenCalledWith(
        'existing-session',
        'test query',
        []
      );
    });

    it('should send a chat message and return formatted response', async () => {
      const result = await handleChatWithOnyx({ query: 'test query' }, mockOnyxApiService);
      
      expect(mockOnyxApiService.sendChatMessage).toHaveBeenCalledWith(
        'test-session-id',
        'test query',
        []
      );
      
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Test answer');
      expect(result.content[0].text).toContain('Test Document 1');
      expect(result.content[0].text).toContain('doc2');
      
      // Use type assertion to access metadata
      const content = result.content[0] as any;
      expect(content.metadata?.chat_session_id).toBe('test-session-id');
    });

    it('should handle API errors gracefully', async () => {
      // Mock the API to throw an error
      mockOnyxApiService.createChatSession = jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('API error'));
      });
      
      const result = await handleChatWithOnyx({ query: 'test query' }, mockOnyxApiService);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error chatting with Onyx');
      expect(result.content[0].text).toContain('API error');
    });
  });

  describe('handleSearchOnyx', () => {
    beforeEach(() => {
      // Set up the mock implementations
      mockOnyxApiService.searchOnyx = jest.fn().mockImplementation(() => {
        const results: OnyxSearchResult[] = [
          {
            document_id: 'doc1',
            chunk_ind: 1,
            semantic_identifier: 'Test Document 1',
            score: 0.95,
            link: 'http://example.com/doc1',
            blurb: 'Test blurb 1',
            source_type: 'test'
          },
          {
            document_id: 'doc2',
            chunk_ind: 2,
            semantic_identifier: 'Test Document 2',
            score: 0.85,
            link: 'http://example.com/doc2',
            blurb: 'Test blurb 2',
            source_type: 'test'
          }
        ];
        return Promise.resolve(results);
      });
      
      mockOnyxApiService.fetchDocumentChunk = jest.fn().mockImplementation(
        (docId: string, chunkId: number) => Promise.resolve(`Content for ${docId} chunk ${chunkId}`)
      );
      
      mockOnyxApiService.fetchDocumentContent = jest.fn().mockImplementation(
        (docId: string) => Promise.resolve(`Full content for ${docId}`)
      );
      
      mockOnyxApiService.buildContext = jest.fn().mockReturnValue('Formatted context');
    });

    it('should throw an error for invalid arguments', async () => {
      // Test with null arguments
      const result1 = await handleSearchOnyx(null, mockOnyxApiService);
      expect(result1.isError).toBe(true);
      expect(result1.content[0].text).toContain('Invalid arguments');

      // Test with non-object arguments
      const result2 = await handleSearchOnyx('not an object', mockOnyxApiService);
      expect(result2.isError).toBe(true);
      expect(result2.content[0].text).toContain('Invalid arguments');
    });

    it('should throw an error for missing query', async () => {
      const result = await handleSearchOnyx({ maxResults: 5 }, mockOnyxApiService);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Query is required');
    });

    it('should search with default parameters when only query is provided', async () => {
      await handleSearchOnyx({ query: 'test query' }, mockOnyxApiService);
      
      expect(mockOnyxApiService.searchOnyx).toHaveBeenCalledWith(
        'test query',
        [],
        1,
        1
      );
    });

    it('should search with custom parameters when provided', async () => {
      await handleSearchOnyx({
        query: 'test query',
        documentSets: ['set1', 'set2'],
        maxResults: 10,
        chunksAbove: 2,
        chunksBelow: 3,
      }, mockOnyxApiService);
      
      expect(mockOnyxApiService.searchOnyx).toHaveBeenCalledWith(
        'test query',
        ['set1', 'set2'],
        2,
        3
      );
    });

    it('should fetch document chunks by default', async () => {
      await handleSearchOnyx({ query: 'test query' }, mockOnyxApiService);
      
      expect(mockOnyxApiService.fetchDocumentChunk).toHaveBeenCalledTimes(2);
      expect(mockOnyxApiService.fetchDocumentContent).not.toHaveBeenCalled();
    });

    it('should fetch full documents when retrieveFullDocuments is true', async () => {
      await handleSearchOnyx({
        query: 'test query',
        retrieveFullDocuments: true,
      }, mockOnyxApiService);
      
      expect(mockOnyxApiService.fetchDocumentContent).toHaveBeenCalledTimes(2);
      expect(mockOnyxApiService.fetchDocumentChunk).not.toHaveBeenCalled();
    });

    it('should build and return context from search results', async () => {
      const result = await handleSearchOnyx({ query: 'test query' }, mockOnyxApiService);
      
      expect(mockOnyxApiService.buildContext).toHaveBeenCalled();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe('Formatted context');
    });

    it('should handle API errors gracefully', async () => {
      // Mock the API to throw an error
      mockOnyxApiService.searchOnyx = jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('API error'));
      });
      
      const result = await handleSearchOnyx({ query: 'test query' }, mockOnyxApiService);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error searching Onyx');
      expect(result.content[0].text).toContain('API error');
    });
  });
});