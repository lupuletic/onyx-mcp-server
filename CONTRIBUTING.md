# Contributing to Onyx MCP Server

Thank you for your interest in contributing to Onyx MCP Server! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of the project which the suggestion is related to.
* **Explain why this enhancement would be useful** to most users.
* **List some other applications where this enhancement exists.**

### Pull Requests

The process described here has several goals:

- Maintain the project's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible solution
- Enable a sustainable system for the project's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. **Fork the repository** and create your branch from `main`.
2. **Add tests if applicable** for your changes.
3. **Ensure the test suite passes** if applicable.
4. **Make sure your code lints** (if applicable).
5. **Submit a pull request** with a clear title and description.

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Development Setup

To set up the project for local development:

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/onyx-mcp-server.git
   cd onyx-mcp-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Make your changes and commit them with descriptive commit messages.
6. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a pull request on GitHub.

## Coding Guidelines

### TypeScript Style Guide

- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use semicolons at the end of statements
- Use single quotes for strings
- Add appropriate JSDoc comments for public APIs

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

Example:
```
feat: add support for chat session persistence
```

## License

By contributing to Onyx MCP Server, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).