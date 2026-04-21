// MCP Prompt Handlers for Huntress MCP Server
// Exposes pre-baked prompt templates via ListPrompts and GetPrompt handlers

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

export function registerPromptHandlers(server: Server): void {
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: [
      {
        name: 'incident-triage',
        description: 'Review all open Huntress incidents and prioritize response',
        arguments: [],
      },
      {
        name: 'org-coverage-check',
        description: 'Verify agent deployment and SOC coverage for an organization',
        arguments: [
          {
            name: 'org_name',
            description: 'Filter to a specific organization (optional — checks all orgs if omitted)',
            required: false,
          },
        ],
      },
      {
        name: 'remediation-review',
        description: 'Review pending remediations for an incident and recommend approve/reject',
        arguments: [
          {
            name: 'incident_id',
            description: 'The Huntress incident ID to review remediations for',
            required: true,
          },
        ],
      },
    ],
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'incident-triage':
        return {
          description: 'Review and prioritize all open Huntress incidents',
          messages: [
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: [
                  'Review all open Huntress incidents and produce a prioritized response plan.',
                  '',
                  'Use the available Huntress tools to:',
                  '1. Navigate to the incidents domain and list all open/active incidents,',
                  '2. Group by severity (critical, high, medium, low),',
                  '3. For each incident, note: organization, affected hosts, incident type, age, and current status,',
                  '4. Identify any incidents with pending remediations that need approval,',
                  '5. Flag incidents older than 24 hours that are still unresolved,',
                  '6. Recommend an order of response prioritized by severity and business impact.',
                  '',
                  'Present as an incident dashboard with a summary, then actionable priority list.',
                  'Call out any incidents that appear to be active threats requiring immediate action.',
                ].join('\n'),
              },
            },
          ],
        };

      case 'org-coverage-check':
        return {
          description: 'Verify agent deployment and SOC coverage',
          messages: [
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: [
                  `Check Huntress agent deployment and SOC coverage${args?.org_name ? ` for ${args.org_name}` : ' across all organizations'}.`,
                  '',
                  'Use the available Huntress tools to:',
                  '1. Navigate to the organizations domain and list target organization(s),',
                  '2. For each org, check: total agents deployed vs expected coverage,',
                  '3. Identify any agents that are offline or have not checked in recently,',
                  '4. Verify SOC (Managed Detection & Response) is active,',
                  '5. Flag any devices in the org that do NOT have a Huntress agent installed',
                  '   (cross-reference with total device count if available),',
                  '6. Identify any agents running outdated versions.',
                  '',
                  'Present a coverage report with: total orgs checked, coverage percentage,',
                  'gap count, and a prioritized list of gaps to remediate.',
                ].join('\n'),
              },
            },
          ],
        };

      case 'remediation-review':
        return {
          description: 'Review pending remediations for an incident',
          messages: [
            {
              role: 'user' as const,
              content: {
                type: 'text' as const,
                text: [
                  `Review all pending remediations for Huntress incident #${args?.incident_id} and provide approve/reject recommendations.`,
                  '',
                  'Use the available Huntress tools to:',
                  '1. Navigate to the incidents domain and fetch details for this incident,',
                  '2. Retrieve all pending remediations associated with the incident,',
                  '3. For each remediation, evaluate:',
                  '   - What action will be taken (process kill, file deletion, isolation, etc.)',
                  '   - Which hosts/users will be affected',
                  '   - Potential for disruption to legitimate business operations',
                  '   - Confidence level that this is malicious vs false positive',
                  '4. Recommend APPROVE or REJECT for each remediation with a brief justification.',
                  '',
                  'Present as a structured review: Incident summary, then a table of remediations',
                  'with your recommendation and reasoning for each.',
                  'Conclude with any additional context or caveats for the approving engineer.',
                ].join('\n'),
              },
            },
          ],
        };

      default:
        throw new Error(`Unknown prompt: ${name}`);
    }
  });
}
