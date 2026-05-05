import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { DomainName } from '../utils/types.js';

export const DOMAINS: DomainName[] = ['accounts', 'agents', 'organizations', 'incidents', 'billing', 'signals', 'users'];

export function getNavigationTools(): Tool[] {
  return [
    {
      name: 'huntress_navigate',
      description: `Discover available Huntress tools by domain. Returns tool names and descriptions for the selected domain. All tools are callable at any time — this is a help/discovery aid, not a prerequisite.`,
      inputSchema: {
        type: 'object' as const,
        properties: {
          domain: {
            type: 'string',
            enum: DOMAINS,
            description: `The domain to explore:
- accounts: account info, current actor
- agents: list/get endpoint agents
- organizations: CRUD organizations
- incidents: incident reports, escalations, remediations
- billing: billing reports, summary reports
- signals: list/get security signals
- users: membership CRUD`,
          },
        },
        required: ['domain'],
      },
    },
    {
      name: 'huntress_status',
      description: 'Check Huntress API connection status and available domains.',
      inputSchema: { type: 'object' as const, properties: {} },
    },
  ];
}

