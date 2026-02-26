import { HuntressClient } from 'node-huntress';
import { logger } from './logger.js';

let _client: HuntressClient | null = null;
let _credKey: string | null = null;

interface Credentials {
  apiKey: string;
  apiSecret: string;
}

export function getCredentials(): Credentials | null {
  const apiKey = process.env.HUNTRESS_API_KEY;
  const apiSecret = process.env.HUNTRESS_API_SECRET;
  if (!apiKey || !apiSecret) {
    logger.warn('Missing credentials', { hasApiKey: !!apiKey, hasApiSecret: !!apiSecret });
    return null;
  }
  return { apiKey, apiSecret };
}

export async function getClient(): Promise<HuntressClient> {
  const creds = getCredentials();
  if (!creds) throw new Error('No Huntress API credentials configured. Set HUNTRESS_API_KEY and HUNTRESS_API_SECRET.');

  const key = `${creds.apiKey}:${creds.apiSecret}`;
  if (_client && _credKey === key) return _client;

  _client = new HuntressClient(creds);
  _credKey = key;
  logger.info('Created Huntress API client');
  return _client;
}
