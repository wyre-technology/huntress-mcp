import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { DomainHandler, CallToolResult } from '../utils/types.js';
import { getClient } from '../utils/client.js';
import { logger } from '../utils/logger.js';

function getTools(): Tool[] {
  return [
    {
      name: 'huntress_agents_list',
      description: 'List Huntress agents with optional filters.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          limit: { type: 'number', description: 'Max results (1-500, default 10)' },
          page_token: { type: 'string', description: 'Pagination token' },
          organization_id: { type: 'number', description: 'Filter by organization ID' },
          platform: { type: 'string', enum: ['windows', 'darwin', 'linux'], description: 'Filter by platform' },
        },
      },
    },
    {
      name: 'huntress_agents_get',
      description: 'Get a single agent by ID.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          id: { type: 'number', description: 'Agent ID' },
        },
        required: ['id'],
      },
    },
  ];
}

async function handleCall(toolName: string, args: Record<string, unknown>): Promise<CallToolResult> {
  const client = await getClient();

  switch (toolName) {
    case 'huntress_agents_list': {
      const params = {
        limit: args.limit as number | undefined,
        page_token: args.page_token as string | undefined,
        organization_id: args.organization_id as number | undefined,
        platform: args.platform as 'windows' | 'darwin' | 'linux' | undefined,
      };
      logger.info('API call: agents.list', params);
      const result = await client.agents.list(params);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    case 'huntress_agents_get': {
      const id = args.id as number;
      logger.info('API call: agents.get', { id });
      const agent = await client.agents.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(agent, null, 2) }] };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }], isError: true };
  }
}

export const agentsHandler: DomainHandler = { getTools, handleCall };
