# Onyx MCP Server Usage Examples

This document provides practical examples of how to use the Onyx MCP Server in various scenarios. These examples demonstrate the versatility of the server for different use cases.

## Basic Search Examples

### Simple Search Query

This example shows a basic search across all document sets:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "company vacation policy",
  "maxResults": 3
}
</arguments>
</use_mcp_tool>
```

### Targeted Search with Document Sets

This example shows how to search within specific document sets:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "quarterly financial results",
  "documentSets": ["Financial Reports", "Investor Relations"],
  "maxResults": 5
}
</arguments>
</use_mcp_tool>
```

### Retrieving Full Documents

This example shows how to retrieve entire documents instead of just chunks:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "employee handbook",
  "documentSets": ["HR Policies"],
  "maxResults": 1,
  "retrieveFullDocuments": true
}
</arguments>
</use_mcp_tool>
```

### Adjusting Context Window

This example shows how to get more context around the matching chunks:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "product roadmap 2025",
  "documentSets": ["Product Planning"],
  "maxResults": 2,
  "chunksAbove": 2,
  "chunksBelow": 2
}
</arguments>
</use_mcp_tool>
```

## Chat Examples

### Basic Question

This example shows a simple question to the chat tool:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "What is our company's return policy?"
}
</arguments>
</use_mcp_tool>
```

### Using a Specific Persona

This example shows how to use a specific persona for the chat:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "How do I set up two-factor authentication for my account?",
  "personaId": 2
}
</arguments>
</use_mcp_tool>
```

### Conversation with Follow-up Questions

This example shows how to maintain a conversation with follow-up questions:

First question:
```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "What are the steps to onboard a new client?"
}
</arguments>
</use_mcp_tool>
```

Follow-up question (using the chat_session_id from the previous response):
```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "What documentation do I need to collect from them?",
  "chatSessionId": "session-id-from-previous-response"
}
</arguments>
</use_mcp_tool>
```

## Use Case Examples

### Customer Support

This example shows how a customer support agent might use the tools to help a customer:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "A customer is having trouble resetting their password. What troubleshooting steps should I recommend?",
  "documentSets": ["Support Documentation", "Knowledge Base"]
}
</arguments>
</use_mcp_tool>
```

### Research and Analysis

This example shows how a researcher might use the tools to gather information:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "market trends renewable energy sector",
  "documentSets": ["Market Research", "Industry Reports"],
  "maxResults": 5,
  "retrieveFullDocuments": true
}
</arguments>
</use_mcp_tool>
```

### Training and Onboarding

This example shows how a new employee might use the tools during onboarding:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "What are the main projects my team is currently working on and what is my role expected to be?",
  "documentSets": ["Team Documentation", "Project Plans", "Onboarding Materials"]
}
</arguments>
</use_mcp_tool>
```

### Legal and Compliance

This example shows how a legal team member might use the tools:

```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "GDPR compliance requirements for customer data",
  "documentSets": ["Legal Documents", "Compliance Policies"],
  "maxResults": 3,
  "chunksAbove": 2,
  "chunksBelow": 2
}
</arguments>
</use_mcp_tool>
```

## Advanced Usage

### Combining Search and Chat

For complex queries, you can first use search to find specific information, then use chat to synthesize or explain it:

1. First, search for specific information:
```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>search_onyx</tool_name>
<arguments>
{
  "query": "Q4 2024 sales figures by region",
  "documentSets": ["Financial Reports"],
  "maxResults": 2
}
</arguments>
</use_mcp_tool>
```

2. Then, use chat to analyze or explain the results:
```
<use_mcp_tool>
<server_name>onyx-search</server_name>
<tool_name>chat_with_onyx</tool_name>
<arguments>
{
  "query": "Based on our Q4 2024 sales figures, which regions showed the strongest growth and what factors contributed to this growth?",
  "documentSets": ["Financial Reports", "Market Analysis"]
}
</arguments>
</use_mcp_tool>
```

### Using with Different MCP Clients

The Onyx MCP Server can be used with any MCP-compatible client. The examples above use the standard MCP tool format, but the specific syntax might vary slightly depending on your client. Consult your client's documentation for the exact format.