# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Onyx MCP Server seriously. If you believe you've found a security vulnerability, please follow these steps:

### Do Not Disclose Publicly

Please **do not** disclose the vulnerability publicly until it has been addressed by the maintainers.

### Reporting Process

1. **Email**: Send details of the vulnerability to [security@example.com](mailto:security@example.com) with the subject line "Onyx MCP Server Security Vulnerability"
   
2. **Include Details**: In your report, please include:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Any suggestions for remediation if you have them
   
3. **Response Time**: We aim to acknowledge receipt of your report within 48 hours and will strive to provide a timeline for resolution within 1 week.

4. **Updates**: We will keep you informed about the progress of addressing the vulnerability.

5. **Recognition**: We're happy to acknowledge your contribution in our release notes if you wish (and if the vulnerability is confirmed).

## Security Best Practices for Users

When using Onyx MCP Server, we recommend the following security best practices:

1. **API Tokens**: Keep your Onyx API tokens secure and do not share them. Consider using environment variables rather than hardcoding them.

2. **Regular Updates**: Keep your installation up to date with the latest security patches.

3. **Access Control**: Limit access to the MCP server to only trusted clients and users.

4. **Network Security**: Consider running the server behind a firewall or VPN if accessing sensitive information.

5. **Audit Logs**: Monitor access and usage patterns for any unusual activity.

## Security Features

Onyx MCP Server includes several security features:

- Environment variable-based configuration to avoid hardcoded secrets
- Secure handling of API tokens
- Error messages that avoid leaking sensitive information

## Third-Party Dependencies

We regularly review and update our dependencies to address known vulnerabilities. If you discover a vulnerability in one of our dependencies that affects Onyx MCP Server, please report it using the process above.