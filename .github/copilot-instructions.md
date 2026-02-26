# Copilot Code Review Instructions — MCP Server Template

> This file applies to all WYRE MCP servers.

## Review Philosophy
- Only comment when you have HIGH CONFIDENCE (>80%) that an issue exists
- Be concise: one sentence per comment when possible
- Focus on actionable feedback, not observations
- Do not suggest style changes unless they cause bugs or violate existing patterns

## Project Context
- **Stack**: TypeScript (ESM), MCP SDK (`@modelcontextprotocol/sdk`), `node-huntress` client library
- **Transport**: Dual-mode — stdio (local/Claude Desktop) and Streamable HTTP (gateway)
- **Auth modes**: Local (env vars) and Gateway (credentials injected via HTTP headers by the gateway proxy)
- **Tool pattern**: Decision-tree — a navigation tool exposes domains first, then dynamically loads domain-specific tools to avoid overwhelming Claude with 20+ tools at once
- **Packaging**: MCPB bundles (`.mcpb`) for one-click Claude Desktop install, Docker images for gateway deployment
- **CI/CD**: GitHub Actions — CI on push, semantic-release on main, Docker build + MCPB upload on release
- **Testing**: Vitest

## Priority Areas (Review These)

### Security
- Credentials must NEVER be logged, even at debug level
- Input validation: tool parameters from Claude must be validated before hitting vendor APIs
- No hardcoded credentials, API keys, or URLs — everything must come from env vars or gateway headers
- HTTP requests to vendor APIs must use HTTPS only

### Correctness
- Tool handlers must return proper MCP error responses, never throw unhandled exceptions
- Missing credentials should produce a clear error message, not crash the server
- Pagination: vendor API calls that return lists must handle pagination correctly
- Rate limiting: respect Huntress API rate limits (60 req/min)
- Resource cleanup: HTTP server must handle SIGINT/SIGTERM gracefully
- Dual-mode: changes must work in both stdio and HTTP transport modes

### Architecture & Patterns
- Tool registration must follow the decision-tree pattern: navigation tool → domain selection → domain-specific tools
- Service layer handles all vendor API calls; tool handlers should not make HTTP requests directly
- Use `node-huntress` client library for API calls, not raw `fetch`
- Error responses from Huntress APIs should be mapped to meaningful MCP error messages

## Do NOT Comment On
- Test file structure or test naming
- Minor type annotations that don't affect correctness
- Import ordering or grouping
- Comments that restate what the code does
- Formatting — that's the linter's job
