import type { Server } from '@modelcontextprotocol/sdk/server/index.js';

export async function elicitCredentials(server: Server): Promise<{ apiKey: string; apiSecret: string } | null> {
  try {
    const result = await (server as any).elicitInput({
      mode: 'form',
      message: 'Huntress API credentials are required. Generate them at your Huntress portal under API Credentials.',
      requestedSchema: {
        type: 'object',
        properties: {
          api_key: {
            type: 'string',
            title: 'API Key',
            description: 'Your Huntress API public key',
          },
          api_secret: {
            type: 'string',
            title: 'API Secret',
            description: 'Your Huntress API secret key',
          },
        },
        required: ['api_key', 'api_secret'],
      },
    });

    if (result?.action === 'accept' && result.content) {
      return {
        apiKey: result.content.api_key as string,
        apiSecret: result.content.api_secret as string,
      };
    }
  } catch {
    // Elicitation not supported by client
  }

  return null;
}
