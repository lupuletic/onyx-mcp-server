/**
 * Unit tests for the main entry point
 */
import * as fs from 'fs';
import * as path from 'path';

describe('Main Entry Point', () => {
  it('should have a main function that starts the server', async () => {
    // Simple test to verify the file exists and has the expected content
    const indexPath = path.resolve(__dirname, '../index.ts');
    const fileExists = fs.existsSync(indexPath);
    expect(fileExists).toBe(true);
    
    // Read the file content
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // Verify it contains the expected functions and imports
    expect(content).toContain('async function main()');
    expect(content).toContain('import { StdioServerTransport }');
    expect(content).toContain('import { OnyxMcpServer }');
    expect(content).toContain('main().catch(console.error)');
  });
});