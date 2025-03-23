# Getting Started with Onyx MCP Server

This guide will help you set up and start using the Onyx MCP Server to connect your MCP-compatible clients with your Onyx knowledge base.

## Prerequisites

Before you begin, make sure you have:

- Node.js (v16 or higher) installed
- An Onyx instance with API access
- An Onyx API token

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/onyx-mcp-server.git
cd onyx-mcp-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Server

```bash
npm run build
```

### 4. Configure Environment Variables

Set up your Onyx API token and URL:

```bash
export ONYX_API_TOKEN="your-api-token-here"
export ONYX_API_URL="http://localhost:8080/api"  # Adjust as needed
```

For persistent configuration, you can add these to your shell profile or use a `.env` file (requires additional setup).

### 5. Start the Server

```bash
npm start
```

You should see a message indicating that the Onyx Search MCP server is running on stdio.

## Configuring MCP Clients

To use the Onyx MCP Server with your MCP clients, you'll need to configure them to connect to the server.

### For Claude Desktop App

Add the following to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "onyx-search": {
      "command": "node",
      "args": ["/path/to/onyx-mcp-server/build/index.js"],
      "env": {
        "ONYX_API_TOKEN": "your-api-token-here",
        "ONYX_API_URL": "http://localhost:8080/api"
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

### For Claude in VSCode (Cline)

Add the following to your Cline MCP settings file:

```json
{
  "mcpServers": {
    "onyx-search": {
      "command": "node",
      "args": ["/path/to/onyx-mcp-server/build/index.js"],
      "env": {
        "ONYX_API_TOKEN": "your-api-token-here",
        "ONYX_API_URL": "http://localhost:8080/api"
      },
      "disabled": false, 
      "alwaysAllow": []
    }
  }
}
```

## Verifying the Installation

To verify that the server is working correctly:

1. Start the server using `npm start`
2. Configure your MCP client as described above
3. In your MCP client, try using one of the Onyx tools:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "test query",
  "maxResults": 1
}
</arguments>
</use_mcp_tool>
```

If everything is set up correctly, you should receive search results from your Onyx knowledge base.

## Next Steps

- Check out the [API Documentation](./api.md) for details on the available tools and their parameters
- See the [Examples](./examples.md) for common usage patterns
- Read the [Troubleshooting Guide](./troubleshooting.md) if you encounter any issues