import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { DomainHandler, CallToolResult } from '../utils/types.js';
import { getClient } from '../utils/client.js';
import { logger } from '../utils/logger.js';

function getTools(): Tool[] {
  return [
    {
      name: 'huntress_signals_list',
      description: 'List security signals.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          limit: { type: 'number' },
          page_token: { type: 'string' },
          investigated_at_min: { type: 'string' },
          investigated_at_max: { type: 'string' },
          entity_type: { type: 'string' },
          entity_id: { type: 'string' },
          organization_id: { type: 'number' },
          types: { type: 'string' },
          statuses: { type: 'string' },
        },
      },
    },
    {
      name: 'huntress_signals_get',
      description: 'Get signal by ID.',
      inputSchema: {
        type: 'object' as const,
        properties: { id: { type: 'number', description: 'Signal ID' } },
        required: ['id'],
      },
    },
  ];
}

async function handleCall(toolName: string, args: Record<string, unknown>): Promise<CallToolResult> {
  const client = await getClient();

  switch (toolName) {
    case 'huntress_signals_list': {
      logger.info('API call: signals.list');
      const result = await client.signals.list(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    case 'huntress_signals_get': {
      const id = args.id as number;
      logger.info('API call: signals.get', { id });
      const signal = await client.signals.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(signal, null, 2) }] };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }], isError: true };
  }
}

export const signalsHandler: DomainHandler = { getTools, handleCall };
