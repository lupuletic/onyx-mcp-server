#!/usr/bin/env python3
"""
MCP Test Client for Onyx MCP Server

This script provides a simple client to test the Model Context Protocol (MCP) server
over HTTP transport.
"""

import argparse
import json
import os
import sys
import uuid
import requests

# Default values
DEFAULT_SERVER_URL = "http://localhost:3000"
DEFAULT_ENDPOINT = "/mcp"

class McpClient:
    """Client for the Model Context Protocol (MCP) server."""
    
    def __init__(self, server_url=DEFAULT_SERVER_URL, endpoint=DEFAULT_ENDPOINT):
        """Initialize the MCP client.
        
        Args:
            server_url: Base URL of the MCP server
            endpoint: MCP endpoint path
        """
        self.server_url = server_url
        self.endpoint = endpoint
        self.request_id = 1
        
    def send_request(self, method, params=None):
        """Send a request to the MCP server.
        
        Args:
            method: The MCP method to call
            params: Parameters for the method
            
        Returns:
            The JSON response from the server
        """
        request_data = {
            "jsonrpc": "2.0",
            "id": str(self.request_id),
            "method": method,
            "params": params or {}
        }
        
        self.request_id += 1
        url = f"{self.server_url}{self.endpoint}"
        
        print(f"\nSending request to {url}:")
        print(json.dumps(request_data, indent=2))
        
        try:
            response = requests.post(
                url,
                json=request_data,
                headers={"Content-Type": "application/json"}
            )
            
            response.raise_for_status()
            result = response.json()
            
            print("\nReceived response:")
            print(json.dumps(result, indent=2))
            
            if "error" in result:
                print(f"\nError: {result['error']['message']}")
            
            return result
        
        except requests.exceptions.RequestException as e:
            print(f"\nError communicating with MCP server: {e}")
            return None
        
    def list_tools(self):
        """List available tools on the MCP server."""
        return self.send_request("list_tools")
    
    def call_search_tool(self, query, max_results=5, chunks_above=1, chunks_below=1, 
                        retrieve_full_documents=False, document_sets=None):
        """Call the search_onyx tool.
        
        Args:
            query: The search query
            max_results: Maximum number of results to return
            chunks_above: Number of chunks to include above matches
            chunks_below: Number of chunks to include below matches
            retrieve_full_documents: Whether to retrieve full documents
            document_sets: List of document sets to search
            
        Returns:
            The search results
        """
        params = {
            "name": "search_onyx",
            "arguments": {
                "query": query,
                "maxResults": max_results,
                "chunksAbove": chunks_above,
                "chunksBelow": chunks_below,
                "retrieveFullDocuments": retrieve_full_documents
            }
        }
        
        if document_sets:
            params["arguments"]["documentSets"] = document_sets
            
        return self.send_request("call_tool", params)
    
    def call_chat_tool(self, query, persona_id=None, chat_session_id=None, document_sets=None):
        """Call the chat_with_onyx tool.
        
        Args:
            query: The chat query/question
            persona_id: ID of the persona to use
            chat_session_id: Existing chat session ID (optional)
            document_sets: List of document sets to use
            
        Returns:
            The chat response
        """
        params = {
            "name": "chat_with_onyx",
            "arguments": {
                "query": query,
            }
        }
        
        if persona_id is not None:
            params["arguments"]["personaId"] = persona_id
            
        if chat_session_id:
            params["arguments"]["chatSessionId"] = chat_session_id
            
        if document_sets:
            params["arguments"]["documentSets"] = document_sets
            
        return self.send_request("call_tool", params)
    
def run_interactive_mode(client):
    """Run the client in interactive mode.
    
    Args:
        client: The MCP client instance
    """
    print("\nMCP Test Client - Interactive Mode")
    print("==================================")
    print("Enter 'exit' or 'quit' to exit.")
    
    # Store chat session ID for continuous conversation
    chat_session_id = None
    
    while True:
        print("\nOptions:")
        print("1) List available tools")
        print("2) Search Onyx")
        print("3) Chat with Onyx")
        print("q) Quit")
        
        choice = input("\nEnter choice: ").strip().lower()
        
        if choice in ["q", "quit", "exit"]:
            break
            
        elif choice == "1":
            client.list_tools()
            
        elif choice == "2":
            query = input("Enter search query: ").strip()
            if not query:
                print("Query cannot be empty.")
                continue
                
            max_results = int(input("Max results [5]: ") or "5")
            retrieve_full = input("Retrieve full documents? (y/n) [n]: ").lower() == "y"
            document_sets_input = input("Document sets (comma-separated, leave empty for all): ")
            document_sets = [ds.strip() for ds in document_sets_input.split(",")] if document_sets_input else None
            
            client.call_search_tool(
                query=query,
                max_results=max_results,
                retrieve_full_documents=retrieve_full,
                document_sets=document_sets
            )
            
        elif choice == "3":
            query = input("Enter chat query: ").strip()
            if not query:
                print("Query cannot be empty.")
                continue
                
            if chat_session_id:
                use_existing = input(f"Continue existing chat session? (y/n) [y]: ").lower() != "n"
                if not use_existing:
                    chat_session_id = None
            
            persona_id_input = input("Persona ID (leave empty for default): ")
            persona_id = int(persona_id_input) if persona_id_input.strip() else None
            
            document_sets_input = input("Document sets (comma-separated, leave empty for all): ")
            document_sets = [ds.strip() for ds in document_sets_input.split(",")] if document_sets_input else None
            
            response = client.call_chat_tool(
                query=query,
                persona_id=persona_id,
                chat_session_id=chat_session_id,
                document_sets=document_sets
            )
            
            # Extract the chat session ID for continuing the conversation
            if response and "result" in response and "content" in response["result"]:
                for content_item in response["result"]["content"]:
                    if content_item.get("metadata") and "chat_session_id" in content_item["metadata"]:
                        chat_session_id = content_item["metadata"]["chat_session_id"]
                        print(f"\nChat session ID: {chat_session_id}")
                        break
            
        else:
            print("Unknown option.")

def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="MCP Test Client")
    parser.add_argument("--server", default=DEFAULT_SERVER_URL, help="MCP server URL")
    parser.add_argument("--endpoint", default=DEFAULT_ENDPOINT, help="MCP endpoint path")
    
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # List tools command
    subparsers.add_parser("list-tools", help="List available tools")
    
    # Search command
    search_parser = subparsers.add_parser("search", help="Search Onyx")
    search_parser.add_argument("query", help="Search query")
    search_parser.add_argument("--max-results", type=int, default=5, help="Maximum number of results")
    search_parser.add_argument("--chunks-above", type=int, default=1, help="Number of chunks to include above matches")
    search_parser.add_argument("--chunks-below", type=int, default=1, help="Number of chunks to include below matches")
    search_parser.add_argument("--retrieve-full", action="store_true", help="Retrieve full documents")
    search_parser.add_argument("--document-sets", nargs="+", help="Document sets to search")
    
    # Chat command
    chat_parser = subparsers.add_parser("chat", help="Chat with Onyx")
    chat_parser.add_argument("query", help="Chat query/question")
    chat_parser.add_argument("--persona-id", type=int, help="Persona ID")
    chat_parser.add_argument("--session-id", help="Chat session ID for continuing a conversation")
    chat_parser.add_argument("--document-sets", nargs="+", help="Document sets to use")
    
    return parser.parse_args()

def main():
    """Main entry point."""
    args = parse_args()
    
    client = McpClient(server_url=args.server, endpoint=args.endpoint)
    
    if not args.command or args.command == "interactive":
        run_interactive_mode(client)
        return
        
    if args.command == "list-tools":
        client.list_tools()
        
    elif args.command == "search":
        client.call_search_tool(
            query=args.query,
            max_results=args.max_results,
            chunks_above=args.chunks_above,
            chunks_below=args.chunks_below,
            retrieve_full_documents=args.retrieve_full,
            document_sets=args.document_sets
        )
        
    elif args.command == "chat":
        client.call_chat_tool(
            query=args.query,
            persona_id=args.persona_id,
            chat_session_id=args.session_id,
            document_sets=args.document_sets
        )

if __name__ == "__main__":
    main()