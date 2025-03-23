# Onyx MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/onyx-mcp-server.svg)](https://www.npmjs.com/package/onyx-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/onyx-mcp-server.svg)](https://www.npmjs.com/package/onyx-mcp-server)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lupuletic/onyx-mcp-server/blob/main/CONTRIBUTING.md)

> A Model Context Protocol (MCP) server for seamless integration with Onyx AI knowledge bases.

This MCP server connects any MCP-compatible client to your Onyx knowledge base, allowing you to search and retrieve relevant context from your documents. It provides a bridge between MCP clients and the Onyx API, enabling powerful semantic search and chat capabilities.

<img width="1166" alt="image" src="https://github.com/user-attachments/assets/6396b010-cb1b-489c-98ec-dbb53e3996d2" />


## Features

- **Enhanced Search**: Semantic search across your Onyx document sets with LLM relevance filtering
- **Context Window Retrieval**: Retrieve chunks above and below the matching chunk for better context
- **Full Document Retrieval**: Option to retrieve entire documents instead of just chunks
- **Chat Integration**: Use Onyx's powerful chat API with LLM + RAG for comprehensive answers
- **Configurable Document Set Filtering**: Target specific document sets for more relevant results

## Installation

### Prerequisites

- Node.js (v16 or higher)
- An Onyx instance with API access
- An Onyx API token

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/lupuletic/onyx-mcp-server.git
   cd onyx-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the server:
   ```bash
   npm run build
   ```

4. Configure your Onyx API Token:
   ```bash
   export ONYX_API_TOKEN="your-api-token-here"
   export ONYX_API_URL="http://localhost:8080/api"  # Adjust as needed
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Configuring MCP Clients

### For Claude Desktop App

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Add to your Cline MCP settings file:

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

### For Other MCP Clients

Consult your MCP client's documentation for how to add a custom MCP server. You'll need to provide:

- The command to run the server (`node`)
- The path to the built server file (`/path/to/onyx-mcp-server/build/index.js`)
- Environment variables for `ONYX_API_TOKEN` and `ONYX_API_URL`

## Available Tools

Once configured, your MCP client will have access to two powerful tools:

### 1. Search Tool

The `search_onyx` tool provides direct access to Onyx's search capabilities with enhanced context retrieval:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "customer onboarding process",
  "documentSets": ["Company Policies", "Training Materials"],
  "maxResults": 3,
  "chunksAbove": 1,
  "chunksBelow": 1,
  "retrieveFullDocuments": true
}
</arguments>
</use_mcp_tool>
```

Parameters:
- `query` (required): The topic to search for
- `documentSets` (optional): List of document set names to search within (empty for all)
- `maxResults` (optional): Maximum number of results to return (default: 5, max: 10)
- `chunksAbove` (optional): Number of chunks to include above the matching chunk (default: 1)
- `chunksBelow` (optional): Number of chunks to include below the matching chunk (default: 1)
- `retrieveFullDocuments` (optional): Whether to retrieve full documents instead of just chunks (default: false)

### 2. Chat Tool

The `chat_with_onyx` tool leverages Onyx's powerful chat API with LLM + RAG for comprehensive answers:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "What is our company's policy on remote work?",
  "personaId": 15,
  "documentSets": ["Company Policies", "HR Documents"],
  "chatSessionId": "optional-existing-session-id"
}
</arguments>
</use_mcp_tool>
```

Parameters:
- `query` (required): The question to ask Onyx
- `personaId` (optional): The ID of the persona to use (default: 15)
- `documentSets` (optional): List of document set names to search within (empty for all)
- `chatSessionId` (optional): Existing chat session ID to continue a conversation

#### Chat Sessions

The chat tool supports maintaining conversation context across multiple interactions. After the first call, the response will include a `chat_session_id` in the metadata. You can pass this ID in subsequent calls to maintain context.

## Choosing Between Search and Chat

- **Use Search When**: You need specific, targeted information from documents and want to control exactly how much context is retrieved.
- **Use Chat When**: You need comprehensive answers that combine information from multiple sources, or when you want the LLM to synthesize information for you.

For the best results, you can use both tools in combination - search for specific details and chat for comprehensive understanding.

## Use Cases

- **Knowledge Management**: Access your organization's knowledge base through any MCP-compatible interface
- **Customer Support**: Help support agents quickly find relevant information
- **Research**: Conduct deep research across your organization's documents
- **Training**: Provide access to training materials and documentation
- **Policy Compliance**: Ensure teams have access to the latest policies and procedures

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Linting

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

## Continuous Integration

This project uses GitHub Actions for continuous integration and deployment. The CI pipeline runs on every push to the main branch and on pull requests. It performs the following checks:

- Linting
- Building
- Testing
- Code coverage reporting

### Automated Version Bumping and Publishing

When a PR is merged to the main branch, the project automatically determines the appropriate version bump type and publishes to npm. The system works as follows:

1. **PR Title Validation**: All PR titles are validated against the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - PR titles must start with a type (e.g., `feat:`, `fix:`, `docs:`)
   - This validation happens automatically when a PR is created or updated
   - PRs with invalid titles will fail the validation check

2. **Version Bump Determination**: The system analyzes both the PR title and commit messages to determine the appropriate version bump:
   - PR titles starting with `feat` or containing new features → minor version bump
   - PR titles starting with `fix` or containing bug fixes → patch version bump
   - PR titles containing `BREAKING CHANGE` or with an exclamation mark → major version bump
   - If the PR title doesn't indicate a specific bump type, the system analyzes commit messages
   - The highest priority bump type found in any commit message is used (major > minor > patch)
   - If no conventional commit prefixes are found, defaults to patch

3. **Version Update and Publishing**:
   - Bumps the version in package.json according to semantic versioning
   - Commits and pushes the version change
   - Publishes the new version to npm

This automated process ensures consistent versioning based on the nature of the changes, following semantic versioning principles, and eliminates manual version management.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## Security

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
