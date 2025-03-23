# Troubleshooting Guide

This guide provides solutions for common issues you might encounter when using the Onyx MCP Server.

## Connection Issues

### MCP Client Cannot Connect to the Server

**Symptoms:**
- "Server not found" or similar error in your MCP client
- No response when trying to use Onyx tools

**Possible Solutions:**
1. **Check if the server is running:**
   ```bash
   ps aux | grep onyx-mcp-server
   ```
   If you don't see the server process, start it with `npm start`.

2. **Verify your MCP client configuration:**
   - Ensure the path to the server file is correct
   - Check that the command and arguments are properly formatted

3. **Check for permission issues:**
   - Ensure the server file is executable: `chmod +x build/index.js`
   - Verify you have read/write permissions for the directory

### Server Starts But Immediately Exits

**Symptoms:**
- Server process starts but terminates immediately
- Error messages in terminal about missing dependencies or configuration

**Possible Solutions:**
1. **Check environment variables:**
   ```bash
   echo $ONYX_API_TOKEN
   echo $ONYX_API_URL
   ```
   Ensure both are set correctly.

2. **Verify dependencies are installed:**
   ```bash
   npm install
   ```

3. **Check for build issues:**
   ```bash
   npm run build
   ```
   Look for any compilation errors.

## Authentication Issues

### API Token Errors

**Symptoms:**
- "Unauthorized" or "Invalid token" errors
- Error code 401 in responses

**Possible Solutions:**
1. **Verify your Onyx API token:**
   - Check that `ONYX_API_TOKEN` is set correctly
   - Ensure the token has not expired
   - Try regenerating a new token in your Onyx instance

2. **Check API URL:**
   - Ensure `ONYX_API_URL` points to the correct Onyx API endpoint
   - Verify the Onyx instance is running and accessible

## Search and Chat Issues

### No Results from Search

**Symptoms:**
- Empty results when using the `search_onyx` tool
- "No matching documents found" messages

**Possible Solutions:**
1. **Check your query:**
   - Try a more general query
   - Ensure you're not using special characters that might interfere with the search

2. **Verify document sets:**
   - If you specified document sets, ensure they exist in your Onyx instance
   - Try searching without specifying document sets

3. **Check Onyx indexing:**
   - Verify that your documents are properly indexed in Onyx
   - Check if the Onyx search functionality works directly through the Onyx interface

### Chat Tool Not Responding or Timing Out

**Symptoms:**
- Long delays when using the `chat_with_onyx` tool
- Timeout errors

**Possible Solutions:**
1. **Check Onyx server load:**
   - The Onyx instance might be under heavy load
   - Try again later or with a simpler query

2. **Verify persona ID:**
   - Ensure the specified `personaId` exists in your Onyx instance
   - Try using the default persona (personaId: 15)

3. **Check network connectivity:**
   - Ensure stable connection between the MCP server and Onyx
   - Check for any network restrictions or firewalls

## Common Error Messages

### "Error searching Onyx: Failed to search Onyx"

This generic error can have multiple causes:
- Check your Onyx API URL and token
- Verify network connectivity to the Onyx server
- Check Onyx server logs for more specific error information

### "Error chatting with Onyx: Request failed with status code 404"

This typically means the Onyx API endpoint could not be found:
- Verify your `ONYX_API_URL` is correct
- Ensure the Onyx server is running
- Check if the API paths have changed in your Onyx version

### "Invalid arguments: Query is required"

This error occurs when required parameters are missing:
- Ensure you're providing a `query` parameter in your tool calls
- Check the parameter names for typos

## Getting More Help

If you continue to experience issues:

1. **Check the logs:**
   - Look for error messages in the terminal where the server is running
   - Check your MCP client logs if available

2. **File an issue:**
   - Submit a detailed bug report on our [GitHub Issues page](https://github.com/yourusername/onyx-mcp-server/issues)
   - Include steps to reproduce, expected behavior, and actual behavior

3. **Contact Onyx support:**
   - If the issue seems related to the Onyx API, contact Onyx support
   - Check the [Onyx documentation](https://docs.onyx.app) for API-specific troubleshooting