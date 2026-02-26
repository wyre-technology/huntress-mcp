import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { DomainName, NavigationState } from '../utils/types.js';

const sessionStates = new Map<string, NavigationState>();

export function getState(sessionId: string = 'default'): NavigationState {
  if (!sessionStates.has(sessionId)) {
    sessionStates.set(sessionId, { currentDomain: null });
  }
  return sessionStates.get(sessionId)!;
}

export const DOMAINS: DomainName[] = ['accounts', 'agents', 'organizations', 'incidents', 'billing', 'signals', 'users'];

export function getNavigationTools(): Tool[] {
  return [
    {
      name: 'huntress_navigate',
      description: `Navigate to a domain to see its tools. Domains: ${DOMAINS.join(', ')}.
- accounts: account info, current actor
- agents: list/get endpoint agents
- organizations: CRUD organizations
- incidents: incident reports, escalations, remediations
- billing: billing reports, summary reports
- signals: list/get security signals
- users: membership CRUD`,
      inputSchema: {
        type: 'object' as const,
        properties: {
          domain: {
            type: 'string',
            enum: DOMAINS,
            description: 'The domain to navigate to',
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

export function getBackTool(): Tool {
  return {
    name: 'huntress_back',
    description: 'Return to the domain navigation menu.',
    inputSchema: { type: 'object' as const, properties: {} },
  };
}
