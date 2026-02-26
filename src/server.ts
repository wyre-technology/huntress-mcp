import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getState, getNavigationTools, getBackTool, DOMAINS } from './domains/navigation.js';
import { getDomainHandler } from './domains/index.js';
import { getCredentials } from './utils/client.js';
import { elicitCredentials } from './elicitation/forms.js';
import { logger } from './utils/logger.js';
import type { DomainName } from './utils/types.js';

export function createServer(): Server {
  const server = new Server(
    { name: 'huntress-mcp', version: '1.0.0' },
    {
      capabilities: {
        tools: {},
        logging: {},
      },
    }
  );

  // Dynamic tool list based on navigation state
  server.setRequestHandler(ListToolsRequestSchema, async (_request, extra) => {
    const sessionId = (extra as any)?.sessionId || 'default';
    const state = getState(sessionId);

    if (!state.currentDomain) {
      return { tools: getNavigationTools() };
    }

    const handler = await getDomainHandler(state.currentDomain);
    return { tools: [...handler.getTools(), getBackTool()] };
  });

  // Route tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const { name, arguments: args } = request.params;
    const sessionId = (extra as any)?.sessionId || 'default';
    const state = getState(sessionId);

    // Navigation: navigate
    if (name === 'huntress_navigate') {
      const domain = (args?.domain as string) as DomainName;
      if (!DOMAINS.includes(domain)) {
        return {
          content: [{ type: 'text' as const, text: `Invalid domain: ${domain}. Valid: ${DOMAINS.join(', ')}` }],
          isError: true,
        };
      }

      // Check credentials before navigating
      if (!getCredentials()) {
        const creds = await elicitCredentials(server);
        if (creds) {
          process.env.HUNTRESS_API_KEY = creds.apiKey;
          process.env.HUNTRESS_API_SECRET = creds.apiSecret;
        } else {
          return {
            content: [{ type: 'text' as const, text: 'Huntress API credentials are required. Set HUNTRESS_API_KEY and HUNTRESS_API_SECRET environment variables.' }],
            isError: true,
          };
        }
      }

      state.currentDomain = domain;
      const handler = await getDomainHandler(domain);
      const tools = handler.getTools().map(t => t.name);

      await server.sendToolListChanged();

      return {
        content: [{
          type: 'text' as const,
          text: `Navigated to ${domain}. Available tools: ${tools.join(', ')}`,
        }],
      };
    }

    // Navigation: back
    if (name === 'huntress_back') {
      state.currentDomain = null;
      await server.sendToolListChanged();
      return {
        content: [{ type: 'text' as const, text: 'Returned to domain navigation.' }],
      };
    }

    // Navigation: status
    if (name === 'huntress_status') {
      const creds = getCredentials();
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            connected: !!creds,
            domains: DOMAINS,
            currentDomain: state.currentDomain,
          }, null, 2),
        }],
      };
    }

    // Domain tool calls
    if (!state.currentDomain) {
      return {
        content: [{ type: 'text' as const, text: `Unknown tool: ${name}. Use huntress_navigate first.` }],
        isError: true,
      };
    }

    const handler = await getDomainHandler(state.currentDomain);
    try {
      return await handler.handleCall(name, (args || {}) as Record<string, unknown>, extra);
    } catch (error) {
      logger.error('Tool call failed', { tool: name, error: (error as Error).message });
      return {
        content: [{ type: 'text' as const, text: `Error: ${(error as Error).message}` }],
        isError: true,
      };
    }
  });

  return server;
}
