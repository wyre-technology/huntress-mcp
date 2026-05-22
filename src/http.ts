import { createServer as createHttpServer } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';
import { getCredentials } from './utils/client.js';
import { logger } from './utils/logger.js';

function startHttpServer(): void {
  const port = parseInt(process.env.MCP_HTTP_PORT || '8080', 10);
  const host = process.env.MCP_HTTP_HOST || '0.0.0.0';
  const isGatewayMode = process.env.AUTH_MODE === 'gateway';

  const httpServer = createHttpServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (url.pathname === '/health') {
      // /health is container LIVENESS, not credential-readiness. In gateway
      // mode, credentials arrive per-request via X-Huntress-* headers, not
      // at startup — so checking `getCredentials()` here would always 503
      // the container and the WYRE vendor-monitor would false-red Huntress
      // permanently. Liveness is "the server is accepting traffic"; the
      // credentials state is reported as informational only.
      // Standalone (non-gateway) mode also returns 200 — if the operator
      // ran the server with no creds, that's their config problem and the
      // first tool call will surface it clearly; conflating that with
      // liveness causes more harm than the 503 prevents.
      const creds = getCredentials();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        transport: 'http',
        mode: isGatewayMode ? 'gateway' : 'standalone',
        credentials: { configured: !!creds },
        timestamp: new Date().toISOString(),
      }));
      return;
    }

    if (url.pathname !== '/mcp') {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found', endpoints: ['/mcp', '/health'] }));
      return;
    }

    if (isGatewayMode) {
      const apiKey = req.headers['x-huntress-api-key'] as string;
      const apiSecret = req.headers['x-huntress-api-secret'] as string;
      if (apiKey && apiSecret) {
        process.env.HUNTRESS_API_KEY = apiKey;
        process.env.HUNTRESS_API_SECRET = apiSecret;
      }
      // Don't reject — tools/list works without credentials
    }

    // Create fresh server + transport per request (stateless)
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on('close', () => {
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res);
  });

  httpServer.listen(port, host, () => {
    logger.info(`HTTP streaming server listening on ${host}:${port}`);
  });
}

const transport = process.env.MCP_TRANSPORT;
if (transport === 'http') {
  startHttpServer();
} else {
  import('./index.js');
}
