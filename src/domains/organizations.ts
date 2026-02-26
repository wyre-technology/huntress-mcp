import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { DomainHandler, CallToolResult } from '../utils/types.js';
import { getClient } from '../utils/client.js';
import { logger } from '../utils/logger.js';

function getTools(): Tool[] {
  return [
    {
      name: 'huntress_organizations_list',
      description: 'List organizations.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          limit: { type: 'number', description: 'Max results (1-500)' },
          page_token: { type: 'string', description: 'Pagination token' },
        },
      },
    },
    {
      name: 'huntress_organizations_get',
      description: 'Get organization by ID.',
      inputSchema: {
        type: 'object' as const,
        properties: { id: { type: 'number', description: 'Organization ID' } },
        required: ['id'],
      },
    },
    {
      name: 'huntress_organizations_create',
      description: 'Create a new organization.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          name: { type: 'string', description: 'Organization name (max 256 chars)' },
          key: { type: 'string', description: 'Organization key for agent grouping (max 256 chars)' },
        },
        required: ['name', 'key'],
      },
    },
    {
      name: 'huntress_organizations_update',
      description: 'Update an organization.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          id: { type: 'number', description: 'Organization ID' },
          name: { type: 'string', description: 'New name' },
          key: { type: 'string', description: 'New key' },
          report_recipients: { type: 'array', items: { type: 'string' }, description: 'Email recipients for reports' },
        },
        required: ['id'],
      },
    },
    {
      name: 'huntress_organizations_delete',
      description: 'Delete an organization.',
      inputSchema: {
        type: 'object' as const,
        properties: { id: { type: 'number', description: 'Organization ID' } },
        required: ['id'],
      },
    },
  ];
}

async function handleCall(toolName: string, args: Record<string, unknown>): Promise<CallToolResult> {
  const client = await getClient();

  switch (toolName) {
    case 'huntress_organizations_list': {
      logger.info('API call: organizations.list');
      const result = await client.organizations.list({
        limit: args.limit as number | undefined,
        page_token: args.page_token as string | undefined,
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    case 'huntress_organizations_get': {
      const id = args.id as number;
      logger.info('API call: organizations.get', { id });
      const org = await client.organizations.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(org, null, 2) }] };
    }
    case 'huntress_organizations_create': {
      logger.info('API call: organizations.create', { name: args.name });
      const org = await client.organizations.create({
        name: args.name as string,
        key: args.key as string,
      });
      return { content: [{ type: 'text', text: JSON.stringify(org, null, 2) }] };
    }
    case 'huntress_organizations_update': {
      const id = args.id as number;
      logger.info('API call: organizations.update', { id });
      const org = await client.organizations.update(id, {
        name: args.name as string | undefined,
        key: args.key as string | undefined,
        report_recipients: args.report_recipients as string[] | undefined,
      });
      return { content: [{ type: 'text', text: JSON.stringify(org, null, 2) }] };
    }
    case 'huntress_organizations_delete': {
      const id = args.id as number;
      logger.info('API call: organizations.delete', { id });
      await client.organizations.delete(id);
      return { content: [{ type: 'text', text: `Organization ${id} deleted.` }] };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }], isError: true };
  }
}

export const organizationsHandler: DomainHandler = { getTools, handleCall };
