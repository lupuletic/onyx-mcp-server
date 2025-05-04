# Onyx MCP Server Test Client

This Python script provides a client for testing the Onyx MCP (Model Context Protocol) server over HTTP transport.

## Prerequisites

- Python 3.6+
- `requests` library (`pip install requests`)

## Usage

The test client can be used in interactive mode or with command-line arguments.

### Interactive Mode

Run the client without any command-line arguments to enter interactive mode:

```bash
./mcp_client.py
```

This will present a menu where you can:
1. List available tools
2. Search Onyx
3. Chat with Onyx

### Command-Line Mode

You can also use specific commands directly from the command line:

#### List Available Tools

```bash
./mcp_client.py list-tools
```

#### Search Onyx

```bash
./mcp_client.py search "your search query" [options]
```

Options:
- `--max-results N`: Maximum number of results to return (default: 5)
- `--chunks-above N`: Number of chunks to include above matches (default: 1)
- `--chunks-below N`: Number of chunks to include below matches (default: 1)
- `--retrieve-full`: Retrieve full documents instead of just chunks
- `--document-sets SET1 SET2`: Specific document sets to search

#### Chat with Onyx

```bash
./mcp_client.py chat "your question" [options]
```

Options:
- `--persona-id ID`: Persona ID to use (defaults to the server's configuration)
- `--session-id ID`: Chat session ID for continuing a conversation
- `--document-sets SET1 SET2`: Specific document sets to search

### Configuration Options

You can configure the server URL and endpoint:

```bash
./mcp_client.py --server http://localhost:3000 --endpoint /mcp [command]
```

## Examples

Search Onyx:
```bash
./mcp_client.py search "machine learning best practices" --max-results 3
```

Chat with Onyx:
```bash
./mcp_client.py chat "Explain how MCP works"
```

Continue a chat conversation:
```bash
./mcp_client.py chat "Follow up question" --session-id your-session-id
```