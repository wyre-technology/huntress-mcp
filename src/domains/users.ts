import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { DomainHandler, CallToolResult } from '../utils/types.js';
import { getClient } from '../utils/client.js';
import { logger } from '../utils/logger.js';

const PERMISSIONS = ['Admin', 'Security Engineer', 'User', 'Read-only', 'Finance', 'Marketing'];

function getTools(): Tool[] {
  return [
    {
      name: 'huntress_users_list',
      description: 'List memberships (users).',
      inputSchema: {
        type: 'object' as const,
        properties: {
          limit: { type: 'number' },
          page_token: { type: 'string' },
          organization_id: { type: 'number', description: 'Filter by organization ID' },
        },
      },
    },
    {
      name: 'huntress_users_get',
      description: 'Get membership by ID.',
      inputSchema: {
        type: 'object' as const,
        properties: { id: { type: 'number', description: 'Membership ID' } },
        required: ['id'],
      },
    },
    {
      name: 'huntress_users_create',
      description: 'Create a membership (invite a user).',
      inputSchema: {
        type: 'object' as const,
        properties: {
          email: { type: 'string', description: 'User email' },
          first_name: { type: 'string', description: 'First name' },
          last_name: { type: 'string', description: 'Last name' },
          permissions: { type: 'string', enum: PERMISSIONS, description: 'Permission level' },
          organization_id: { type: 'number', description: 'Invite to org instead of account' },
        },
        required: ['email', 'first_name', 'last_name', 'permissions'],
      },
    },
    {
      name: 'huntress_users_update',
      description: 'Update membership permissions.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          id: { type: 'number', description: 'Membership ID' },
          permissions: { type: 'string', enum: PERMISSIONS, description: 'New permission level' },
        },
        required: ['id', 'permissions'],
      },
    },
    {
      name: 'huntress_users_delete',
      description: 'Delete a membership.',
      inputSchema: {
        type: 'object' as const,
        properties: { id: { type: 'number', description: 'Membership ID' } },
        required: ['id'],
      },
    },
  ];
}

async function handleCall(toolName: string, args: Record<string, unknown>): Promise<CallToolResult> {
  const client = await getClient();

  switch (toolName) {
    case 'huntress_users_list': {
      logger.info('API call: memberships.list');
      const result = await client.memberships.list({
        limit: args.limit as number | undefined,
        page_token: args.page_token as string | undefined,
        organization_id: args.organization_id as number | undefined,
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    case 'huntress_users_get': {
      const id = args.id as number;
      logger.info('API call: memberships.get', { id });
      const membership = await client.memberships.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(membership, null, 2) }] };
    }
    case 'huntress_users_create': {
      logger.info('API call: memberships.create', { email: args.email });
      const membership = await client.memberships.create({
        email: args.email as string,
        first_name: args.first_name as string,
        last_name: args.last_name as string,
        permissions: args.permissions as any,
        organization_id: args.organization_id as number | undefined,
      });
      return { content: [{ type: 'text', text: JSON.stringify(membership, null, 2) }] };
    }
    case 'huntress_users_update': {
      const id = args.id as number;
      logger.info('API call: memberships.update', { id });
      const membership = await client.memberships.update(id, {
        permissions: args.permissions as any,
      });
      return { content: [{ type: 'text', text: JSON.stringify(membership, null, 2) }] };
    }
    case 'huntress_users_delete': {
      const id = args.id as number;
      logger.info('API call: memberships.delete', { id });
      await client.memberships.delete(id);
      return { content: [{ type: 'text', text: `Membership ${id} deleted.` }] };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }], isError: true };
  }
}

export const usersHandler: DomainHandler = { getTools, handleCall };
