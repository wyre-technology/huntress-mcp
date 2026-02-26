import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { DomainHandler, CallToolResult } from '../utils/types.js';
import { getClient } from '../utils/client.js';
import { logger } from '../utils/logger.js';

function getTools(): Tool[] {
  return [
    {
      name: 'huntress_accounts_get',
      description: 'Get the Huntress account associated with the current API credentials.',
      inputSchema: { type: 'object' as const, properties: {} },
    },
    {
      name: 'huntress_accounts_actor',
      description: 'Get the current actor (user/account/reseller) for the API credentials.',
      inputSchema: { type: 'object' as const, properties: {} },
    },
  ];
}

async function handleCall(toolName: string, _args: Record<string, unknown>): Promise<CallToolResult> {
  const client = await getClient();

  switch (toolName) {
    case 'huntress_accounts_get': {
      logger.info('API call: accounts.get');
      const account = await client.accounts.get();
      return { content: [{ type: 'text', text: JSON.stringify(account, null, 2) }] };
    }
    case 'huntress_accounts_actor': {
      logger.info('API call: actor.get');
      const actor = await client.actor.get();
      return { content: [{ type: 'text', text: JSON.stringify(actor, null, 2) }] };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }], isError: true };
  }
}

export const accountsHandler: DomainHandler = { getTools, handleCall };
