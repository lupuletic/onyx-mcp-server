/**
 * Unit tests for the OnyxApiService
 */
import nock from 'nock';
import { OnyxApiService } from '../../services/onyxApi.js';
import { OnyxConfig } from '../../types/index.js';

// Mock config for testing
const mockConfig: OnyxConfig = {
  apiUrl: 'http://test-api.com/api',
  apiToken: 'test-token',
  defaultPersonaId: 15,
  httpPort: 3000
};

describe('OnyxApiService', () => {
  let onyxApiService: OnyxApiService;

  beforeEach(() => {
    // Create service instance
    onyxApiService = new OnyxApiService(mockConfig);
    
    // Disable real HTTP requests
    nock.disableNetConnect();
  });

  afterEach(() => {
    // Clean up nock after each test
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe('searchOnyx', () => {
    it('should make a POST request to the search endpoint with correct parameters', async () => {
      // Mock the search API response
      const mockResponse = {
        documents: [
          {
            document_id: 'doc1',
            chunk_ind: 1,
            semantic_identifier: 'Test Document',
            blurb: 'Test blurb',
            source_type: 'test',
            score: 0.95,
          },
        ],
      };

      // Set up the mock
      nock('http://test-api.com')
        .post('/api/admin/search')
        .reply(200, mockResponse);

      // Call the method
      const result = await onyxApiService.searchOnyx('test query', [], 1, 2);

      // Verify the result
      expect(result).toEqual(mockResponse.documents);
    });

    it('should include document sets in the request when provided', async () => {
      // Mock the search API response
      const mockResponse = {
        documents: [
          {
            document_id: 'doc1',
            chunk_ind: 1,
            semantic_identifier: 'Test Document',
            blurb: 'Test blurb',
            source_type: 'test',
            score: 0.95,
          },
        ],
      };

      // Set up the mock
      nock('http://test-api.com')
        .post('/api/admin/search')
        .reply(200, mockResponse);

      // Call the method with document sets
      const result = await onyxApiService.searchOnyx('test query', ['Test Set']);

      // Verify the result
      expect(result).toEqual(mockResponse.documents);
    });

    it('should throw an error when the API request fails', async () => {
      // Set up the mock to return an error
      nock('http://test-api.com')
        .post('/api/admin/search')
        .reply(500, { error: 'Internal server error' });

      // Call the method and expect it to throw
      await expect(onyxApiService.searchOnyx('test query')).rejects.toThrow(
        'Failed to search Onyx'
      );
    });
  });

  describe('fetchDocumentChunk', () => {
    it('should make a GET request to the chunk-info endpoint with correct parameters', async () => {
      // Mock the chunk-info API response
      const mockResponse = {
        content: 'Test chunk content',
        num_tokens: 10,
      };

      // Set up the mock
      nock('http://test-api.com')
        .get('/api/document/chunk-info')
        .query({
          document_id: 'doc1',
          chunk_id: 1,
        })
        .reply(200, mockResponse);

      // Call the method
      const result = await onyxApiService.fetchDocumentChunk('doc1', 1);

      // Verify the result
      expect(result).toEqual(mockResponse.content);
    });

    it('should return empty string when the API request fails', async () => {
      // Set up the mock to return an error
      nock('http://test-api.com')
        .get('/api/document/chunk-info')
        .query({
          document_id: 'doc1',
          chunk_id: 1,
        })
        .reply(500, { error: 'Internal server error' });

      // Call the method
      const result = await onyxApiService.fetchDocumentChunk('doc1', 1);

      // Verify the result
      expect(result).toEqual('');
    });
  });
  
  describe('fetchDocumentContent', () => {
    it('should fetch document size info and then all chunks', async () => {
      // Mock the document-size-info API response
      const mockSizeResponse = {
        num_chunks: 2,
        total_tokens: 20
      };
      
      // Mock the chunk-info API responses
      const mockChunk1Response = {
        content: 'Chunk 1 content',
        num_tokens: 10
      };
      
      const mockChunk2Response = {
        content: 'Chunk 2 content',
        num_tokens: 10
      };

      // Set up the mocks
      nock('http://test-api.com')
        .get('/api/document/document-size-info')
        .query({
          document_id: 'doc1'
        })
        .reply(200, mockSizeResponse);
        
      nock('http://test-api.com')
        .get('/api/document/chunk-info')
        .query({
          document_id: 'doc1',
          chunk_id: 0
        })
        .reply(200, mockChunk1Response);
        
      nock('http://test-api.com')
        .get('/api/document/chunk-info')
        .query({
          document_id: 'doc1',
          chunk_id: 1
        })
        .reply(200, mockChunk2Response);

      // Call the method
      const result = await onyxApiService.fetchDocumentContent('doc1');

      // Verify the result
      expect(result).toContain(mockChunk1Response.content);
      expect(result).toContain(mockChunk2Response.content);
    });

    it('should return empty string when the API request fails', async () => {
      // Set up the mock to return an error
      nock('http://test-api.com')
        .get('/api/document/document-size-info')
        .query({
          document_id: 'doc1'
        })
        .reply(500, { error: 'Internal server error' });

      // Call the method
      const result = await onyxApiService.fetchDocumentContent('doc1');

      // Verify the result
      expect(result).toEqual('');
    });
  });
  
  describe('createChatSession', () => {
    it('should make a POST request to create a chat session', async () => {
      // Mock the create-chat-session API response
      const mockResponse = {
        chat_session_id: 'test-session-id'
      };

      // Set up the mock
      nock('http://test-api.com')
        .post('/api/chat/create-chat-session')
        .reply(200, mockResponse);

      // Call the method
      const result = await onyxApiService.createChatSession(15);

      // Verify the result
      expect(result).toEqual(mockResponse.chat_session_id);
    });

    it('should throw an error when the API request fails', async () => {
      // Set up the mock to return an error
      nock('http://test-api.com')
        .post('/api/chat/create-chat-session')
        .reply(500, { error: 'Internal server error' });

      // Call the method and expect it to throw
      await expect(onyxApiService.createChatSession(15)).rejects.toThrow(
        'Failed to create chat session'
      );
    });
  });
  
  describe('sendChatMessage', () => {
    it('should make a POST request to send a chat message and parse JSON response', async () => {
      // Mock the send-message API response (single JSON)
      const mockResponse = JSON.stringify({
        answer: 'Test answer',
        documents: [
          { document_id: 'doc1', semantic_identifier: 'Test Document 1' },
          { document_id: 'doc2', semantic_identifier: 'Test Document 2' }
        ]
      });

      // Set up the mock
      nock('http://test-api.com')
        .post('/api/chat/send-message')
        .reply(200, mockResponse);

      // Call the method
      const result = await onyxApiService.sendChatMessage('test-session-id', 'test query');

      // Verify the result
      expect(result.answer).toEqual('Test answer');
      expect(result.documents).toHaveLength(2);
      expect(result.documents[0].document_id).toEqual('doc1');
    });

    it('should handle JSON lines format response', async () => {
      // Mock the send-message API response (JSON lines)
      const mockResponse = 
        '{"answer_piece":"Part 1 of answer"}\n' +
        '{"answer_piece":"Part 2 of answer"}\n' +
        '{"top_documents":[{"document_id":"doc1","semantic_identifier":"Test Document 1"}]}';

      // Set up the mock
      nock('http://test-api.com')
        .post('/api/chat/send-message')
        .reply(200, mockResponse);

      // Call the method
      const result = await onyxApiService.sendChatMessage('test-session-id', 'test query');

      // Verify the result
      expect(result.answer).toEqual('Part 1 of answerPart 2 of answer');
      expect(result.documents).toHaveLength(1);
      expect(result.documents[0].document_id).toEqual('doc1');
    });

    it('should throw an error when the API request fails', async () => {
      // Set up the mock to return an error
      nock('http://test-api.com')
        .post('/api/chat/send-message')
        .reply(500, { error: 'Internal server error' });

      // Call the method and expect it to throw
      await expect(onyxApiService.sendChatMessage('test-session-id', 'test query')).rejects.toThrow(
        'Error chatting with Onyx'
      );
    });
  });
  
  describe('buildContext', () => {
    it('should build a formatted context string from search results and contents', () => {
      // Test data
      const results = [
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
          link: undefined,
          blurb: 'Test blurb 2',
          source_type: 'test'
        }
      ];
      
      const contents = [
        'Content for document 1',
        'Content for document 2'
      ];

      // Call the method
      const result = onyxApiService.buildContext(results, contents);

      // Verify the result
      expect(result).toContain('# Test Document 1');
      expect(result).toContain('Source: http://example.com/doc1');
      expect(result).toContain('Relevance Score: 0.95');
      expect(result).toContain('Content for document 1');
      
      expect(result).toContain('# Test Document 2');
      expect(result).toContain('Source: doc2');
      expect(result).toContain('Relevance Score: 0.85');
      expect(result).toContain('Content for document 2');
    });

    it('should skip results with no content', () => {
      // Test data
      const results = [
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
      
      const contents = [
        'Content for document 1',
        '' // Empty content for second document
      ];

      // Call the method
      const result = onyxApiService.buildContext(results, contents);

      // Verify the result
      expect(result).toContain('# Test Document 1');
      expect(result).toContain('Content for document 1');
      
      // Should not contain document 2 info
      expect(result).not.toContain('# Test Document 2');
    });
  });

});