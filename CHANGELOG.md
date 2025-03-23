# Changelog

All notable changes to the Onyx MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Automated version bumping based on conventional commit prefixes in PR titles and commit messages
- Commit message validation using commitlint to enforce conventional commit format
- Interactive commit message creation using commitizen (via `npm run commit`)
- Git hooks to enforce commit message format and code quality

### Changed
- Consolidated CI/CD workflows to avoid duplication
- Improved npm publishing process to automatically determine version bump type
- Enhanced PR template with clearer instructions for conventional commit format

## [1.0.0] - 2025-03-23

### Added
- Initial open source release
- Support for two main tools:
  - `search_onyx`: For semantic search across Onyx document sets
  - `chat_with_onyx`: For conversational interactions with Onyx knowledge base
- Comprehensive documentation:
  - Getting started guide
  - API documentation
  - Troubleshooting guide
  - Usage examples
- MIT License
- Contribution guidelines

### Changed
- Made the project more generic (not just for coding assistants)
- Improved error handling and reporting
- Enhanced README with more detailed instructions and examples

## [0.1.0] - 2025-03-15

### Added
- Initial development version
- Basic search functionality
- Basic chat functionality
- Simple README with installation instructions