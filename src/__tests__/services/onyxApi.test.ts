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

  // Add more tests for other methods as needed
});