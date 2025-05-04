/**
 * Configuration for the Onyx MCP Server
 */
import * as dotenv from 'dotenv';
import { OnyxConfig } from '../types/index.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Load configuration from environment variables
 * @returns The Onyx configuration
 */
export function loadConfig(): OnyxConfig {
  const config: OnyxConfig = {
    apiUrl: process.env.ONYX_API_URL || 'http://localhost:8080/api',
    apiToken: process.env.ONYX_API_TOKEN || '',
    defaultPersonaId: parseInt(process.env.ONYX_DEFAULT_PERSONA_ID || '15', 10),
    httpPort: parseInt(process.env.HTTP_PORT || '3000', 10),
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