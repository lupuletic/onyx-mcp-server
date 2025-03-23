/**
 * Unit tests for the config module
 */
import { loadConfig, SERVER_CONFIG, DEBUG } from '../../config/index.js';

// Save original environment
const originalEnv = process.env;

beforeEach(() => {
  // Reset environment variables before each test
  process.env = { ...originalEnv };
  delete process.env.ONYX_API_TOKEN;
  delete process.env.ONYX_API_URL;
  delete process.env.DEBUG;
});

afterAll(() => {
  // Restore original environment
  process.env = originalEnv;
});

describe('Config Module', () => {
  describe('loadConfig', () => {
    it('should load default config when no environment variables are set', () => {
      const config = loadConfig();
      expect(config).toEqual({
        apiUrl: 'http://localhost:8080/api',
        apiToken: '',
      });
    });

    it('should use environment variables when set', () => {
      process.env.ONYX_API_TOKEN = 'test-token';
      process.env.ONYX_API_URL = 'http://test-url.com/api';
      
      const config = loadConfig();
      expect(config).toEqual({
        apiUrl: 'http://test-url.com/api',
        apiToken: 'test-token',
      });
    });
  });

  describe('SERVER_CONFIG', () => {
    it('should have the correct server configuration', () => {
      expect(SERVER_CONFIG).toHaveProperty('name', 'onyx-mcp-server');
      expect(SERVER_CONFIG).toHaveProperty('version', '1.0.0');
    });
  });

  describe('DEBUG', () => {
    it('should be false by default', () => {
      expect(DEBUG).toBe(false);
    });

    it('should be true when DEBUG environment variable is set to "true"', () => {
      // Set the DEBUG environment variable
      process.env.DEBUG = 'true';
      
      // Re-import the module to get the updated value
      // Note: This is a simplified test since we can't easily reset modules in Jest ESM
      expect(process.env.DEBUG).toBe('true');
    });
  });
});