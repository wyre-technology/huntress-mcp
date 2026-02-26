# huntress-mcp

MCP (Model Context Protocol) server for [Huntress](https://www.huntress.com) — manage agents, organizations, incidents, escalations, billing, signals, and users through Claude.

## Quick Start

### stdio (Claude Desktop)

```json
{
  "mcpServers": {
    "huntress": {
      "command": "node",
      "args": ["/path/to/huntress-mcp/dist/index.js"],
      "env": {
        "HUNTRESS_API_KEY": "your-api-key",
        "HUNTRESS_API_SECRET": "your-api-secret"
      }
    }
  }
}
```

### HTTP Streaming

```bash
HUNTRESS_API_KEY=your-key HUNTRESS_API_SECRET=your-secret MCP_TRANSPORT=http node dist/http.js
```

### Docker

```bash
docker compose up
```

## Domains

The server uses decision-tree navigation. Start with `huntress_navigate` to pick a domain:

| Domain | Tools |
|--------|-------|
| **accounts** | Get account info, get current actor |
| **agents** | List agents, get agent by ID |
| **organizations** | List, get, create, update, delete organizations |
| **incidents** | Incident reports (list/get/resolve), remediations (list/get/approve/reject), escalations (list/get/resolve) |
| **billing** | Billing reports, summary reports |
| **signals** | List/get security signals |
| **users** | Membership CRUD (list/get/create/update/delete) |

## Authentication

Set `HUNTRESS_API_KEY` and `HUNTRESS_API_SECRET` environment variables. If missing, the server will attempt to collect them via MCP elicitation.

Generate credentials at `<your_subdomain>.huntress.io` → API Credentials.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HUNTRESS_API_KEY` | API public key | — |
| `HUNTRESS_API_SECRET` | API secret key | — |
| `MCP_TRANSPORT` | Transport mode (`stdio` or `http`) | `stdio` |
| `MCP_HTTP_PORT` | HTTP server port | `8080` |
| `AUTH_MODE` | Auth mode (`env` or `gateway`) | `env` |
| `LOG_LEVEL` | Log level (`debug`, `info`, `warn`, `error`) | `info` |

## License

Apache 2.0 — Copyright WYRE Technology
