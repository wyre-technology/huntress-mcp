# Huntress MCP Server

[![Build Status](https://github.com/wyre-technology/huntress-mcp/actions/workflows/release.yml/badge.svg)](https://github.com/wyre-technology/huntress-mcp/actions/workflows/release.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides AI assistants with structured access to [Huntress](https://www.huntress.com) cybersecurity platform data and operations.

> **Note:** This project is maintained by [Wyre Technology](https://github.com/wyre-technology).

## Quick Start

**Claude Desktop** — download, open, done:

1. Download `huntress-mcp.mcpb` from the [latest release](https://github.com/wyre-technology/huntress-mcp/releases/latest)
2. Open the file (double-click or drag into Claude Desktop)
3. Enter your Huntress credentials when prompted (API Key, API Secret)

No terminal, no JSON editing, no Node.js install required.

**Claude Code (CLI):**

```bash
claude mcp add huntress-mcp \
  -e HUNTRESS_API_KEY=your-api-key \
  -e HUNTRESS_API_SECRET=your-api-secret \
  -- npx -y github:wyre-technology/huntress-mcp
```

See [Installation](#installation) for Docker and from-source methods.

## Features

- **🔌 MCP Protocol Compliance**: Full support for MCP resources and tools
- **🛡️ Comprehensive Security Coverage**: Tools spanning agents, organizations, incidents, escalations, billing, signals, and users
- **🔍 Decision-Tree Navigation**: Start with `huntress_navigate` to explore domains, then dynamically load domain-specific tools
- **📝 CRUD Operations**: Create, read, update, delete operations for organizations, memberships, incidents, and more
- **🔒 Secure Authentication**: HTTP Basic Auth with Huntress API credentials
- **🌐 Dual Transport**: Supports both stdio (local) and HTTP Streamable (remote/Docker) transports
- **📦 MCPB Packaging**: One-click installation via MCP Bundle for desktop clients
- **🐳 Docker Ready**: Containerized deployment with HTTP transport and health checks
- **⚡ Rate Limiting**: Built-in rate limiter respects Huntress API limits (60 req/min)
- **📊 Structured Logging**: Comprehensive logging with configurable levels

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Domains](#domains)
- [Docker Deployment](#docker-deployment)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Option 1: MCPB Bundle (Claude Desktop)

The simplest method — no terminal, no JSON editing, no Node.js install required.

1. Download `huntress-mcp.mcpb` from the [latest release](https://github.com/wyre-technology/huntress-mcp/releases/latest)
2. Open the file (double-click or drag into Claude Desktop)
3. Enter your Huntress credentials when prompted (API Key, API Secret)

For **Claude Code (CLI)**, one command:

```bash
claude mcp add huntress-mcp \
  -e HUNTRESS_API_KEY=your-api-key \
  -e HUNTRESS_API_SECRET=your-api-secret \
  -- npx -y github:wyre-technology/huntress-mcp
```

### Option 2: Docker

```bash
docker compose up
```

Or pull the pre-built image:

```bash
docker run -d \
  -e HUNTRESS_API_KEY=your-key \
  -e HUNTRESS_API_SECRET=your-secret \
  -p 8080:8080 \
  ghcr.io/wyre-technology/huntress-mcp:latest
```

### Option 3: From Source

```bash
git clone https://github.com/wyre-technology/huntress-mcp.git
cd huntress-mcp
npm ci
npm run build
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `HUNTRESS_API_KEY` | API public key | — |
| `HUNTRESS_API_SECRET` | API secret key | — |
| `MCP_TRANSPORT` | Transport mode (`stdio` or `http`) | `stdio` |
| `MCP_HTTP_PORT` | HTTP server port | `8080` |
| `AUTH_MODE` | Auth mode (`env` or `gateway`) | `env` |
| `LOG_LEVEL` | Log level (`debug`, `info`, `warn`, `error`) | `info` |

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

## Docker Deployment

See [docker-compose.yml](docker-compose.yml) for full configuration. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
# Edit .env with your Huntress API credentials
docker compose up -d
```

## Development

```bash
npm ci
npm run build       # Build the project
npm run dev         # Watch mode
npm run test        # Run tests
npm run lint        # Type-check
npm run clean       # Remove dist/
```

## Testing

```bash
npm test            # Run test suite
npm run test:watch  # Watch mode
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Apache 2.0 — Copyright WYRE Technology
