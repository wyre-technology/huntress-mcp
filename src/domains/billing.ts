import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { DomainHandler, CallToolResult } from '../utils/types.js';
import { getClient } from '../utils/client.js';
import { logger } from '../utils/logger.js';

function getTools(): Tool[] {
  return [
    {
      name: 'huntress_billing_reports_list',
      description: 'List billing reports.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          limit: { type: 'number' },
          page_token: { type: 'string' },
          status: { type: 'string', enum: ['open', 'paid', 'failed', 'partial_refund', 'full_refund', 'draft', 'voided'] },
        },
      },
    },
    {
      name: 'huntress_billing_reports_get',
      description: 'Get billing report by ID.',
      inputSchema: {
        type: 'object' as const,
        properties: { id: { type: 'number', description: 'Billing report ID' } },
        required: ['id'],
      },
    },
    {
      name: 'huntress_summary_reports_list',
      description: 'List summary reports.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          limit: { type: 'number' },
          page_token: { type: 'string' },
          period_min: { type: 'string', description: 'Min period filter' },
          period_max: { type: 'string', description: 'Max period filter' },
          organization_id: { type: 'number' },
          type: { type: 'string' },
        },
      },
    },
    {
      name: 'huntress_summary_reports_get',
      description: 'Get summary report by ID.',
      inputSchema: {
        type: 'object' as const,
        properties: { id: { type: 'number', description: 'Summary report ID' } },
        required: ['id'],
      },
    },
  ];
}

async function handleCall(toolName: string, args: Record<string, unknown>): Promise<CallToolResult> {
  const client = await getClient();

  switch (toolName) {
    case 'huntress_billing_reports_list': {
      logger.info('API call: billingReports.list');
      const result = await client.billingReports.list(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    case 'huntress_billing_reports_get': {
      const id = args.id as number;
      logger.info('API call: billingReports.get', { id });
      const report = await client.billingReports.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(report, null, 2) }] };
    }
    case 'huntress_summary_reports_list': {
      logger.info('API call: summaryReports.list');
      const result = await client.summaryReports.list(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    case 'huntress_summary_reports_get': {
      const id = args.id as number;
      logger.info('API call: summaryReports.get', { id });
      const report = await client.summaryReports.get(id);
      return { content: [{ type: 'text', text: JSON.stringify(report, null, 2) }] };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }], isError: true };
  }
}

export const billingHandler: DomainHandler = { getTools, handleCall };
