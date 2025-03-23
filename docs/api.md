# Onyx MCP Server API Documentation

This document provides detailed information about the tools available in the Onyx MCP Server and how to use them.

## Available Tools

The Onyx MCP Server provides two main tools:

1. `search_onyx`: For direct semantic search across your Onyx document sets
2. `chat_with_onyx`: For conversational interactions with your Onyx knowledge base

## 1. Search Tool (`search_onyx`)

The `search_onyx` tool provides direct access to Onyx's search capabilities with enhanced context retrieval.

### Usage

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "your search query here",
  "documentSets": ["Optional Document Set 1", "Optional Document Set 2"],
  "maxResults": 3,
  "chunksAbove": 1,
  "chunksBelow": 1,
  "retrieveFullDocuments": true
}
</arguments>
</use_mcp_tool>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | The search query to find relevant information |
| `documentSets` | array of strings | No | `[]` (all document sets) | List of document set names to search within |
| `maxResults` | integer | No | 5 | Maximum number of results to return (max: 10) |
| `chunksAbove` | integer | No | 1 | Number of chunks to include above the matching chunk |
| `chunksBelow` | integer | No | 1 | Number of chunks to include below the matching chunk |
| `retrieveFullDocuments` | boolean | No | false | Whether to retrieve full documents instead of just chunks |

### Response

The response will contain the search results with the requested context. Each result includes:

- Document metadata (title, source, etc.)
- The matching content with the requested context
- Relevance score

## 2. Chat Tool (`chat_with_onyx`)

The `chat_with_onyx` tool leverages Onyx's powerful chat API with LLM + RAG for comprehensive answers.

### Usage

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "your question here",
  "personaId": 15,
  "documentSets": ["Optional Document Set 1", "Optional Document Set 2"],
  "chatSessionId": "optional-existing-session-id"
}
</arguments>
</use_mcp_tool>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | The question to ask Onyx |
| `personaId` | integer | No | 15 | The ID of the persona to use |
| `documentSets` | array of strings | No | `[]` (all document sets) | List of document set names to search within |
| `chatSessionId` | string | No | null | Existing chat session ID to continue a conversation |

### Response

The response will contain:

- The answer to your question
- Sources used to generate the answer
- A chat session ID that can be used for follow-up questions

### Maintaining Conversation Context

To maintain context across multiple interactions, extract the `chat_session_id` from the response metadata and include it in subsequent calls:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "follow-up question here",
  "personaId": 15,
  "documentSets": ["Optional Document Set 1", "Optional Document Set 2"],
  "chatSessionId": "session-id-from-previous-response"
}
</arguments>
</use_mcp_tool>
```

## Choosing Between Search and Chat

- **Use Search When**: You need specific, targeted information from documents and want to control exactly how much context is retrieved.
- **Use Chat When**: You need comprehensive answers that combine information from multiple sources, or when you want the LLM to synthesize information for you.

For the best results, you can use both tools in combination - search for specific details and chat for comprehensive understanding.

## Error Handling

Both tools will return an error response if there are issues with the request or the Onyx API. Common errors include:

- Invalid parameters
- Authentication failures
- Onyx API unavailability

Error responses include an `isError` flag set to `true` and an error message explaining the issue.