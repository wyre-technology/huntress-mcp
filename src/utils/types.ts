import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export type DomainName = 'accounts' | 'agents' | 'organizations' | 'incidents' | 'billing' | 'signals' | 'users';

export type CallToolResult = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

export interface DomainHandler {
  getTools(): Tool[];
  handleCall(
    toolName: string,
    args: Record<string, unknown>,
    extra?: unknown
  ): Promise<CallToolResult>;
}

export type NavigationState = {
  currentDomain: DomainName | null;
};
