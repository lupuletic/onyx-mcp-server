/**
 * Configuration for the Onyx MCP Server
 */
import { OnyxConfig } from '../types/index.js';

/**
 * Load configuration from environment variables
 * @returns The Onyx configuration
 */
export function loadConfig(): OnyxConfig {
  const config: OnyxConfig = {
    apiUrl: process.env.ONYX_API_URL || 'http://localhost:8080/api',
    apiToken: process.env.ONYX_API_TOKEN || '',
  };

  if (!config.apiToken) {
    console.error('ONYX_API_TOKEN environment variable is required');
  }

  return config;
}

/**
 * Server configuration
 */
export const SERVER_CONFIG = {
  name: 'onyx-mcp-server',
  version: '1.0.0',
};

/**
 * Debug mode flag
 */
export const DEBUG = process.env.DEBUG === 'true';