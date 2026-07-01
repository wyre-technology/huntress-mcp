import { describe, it, expect, afterEach } from 'vitest';
import { getCredentials, runWithCredentials } from '../utils/client.js';

describe('request-scoped credentials', () => {
  afterEach(() => {
    delete process.env.HUNTRESS_API_KEY;
    delete process.env.HUNTRESS_API_SECRET;
  });

  it('prefers ALS-scoped creds over process.env', () => {
    process.env.HUNTRESS_API_KEY = 'env-key';
    process.env.HUNTRESS_API_SECRET = 'env-secret';
    expect(getCredentials()).toEqual({ apiKey: 'env-key', apiSecret: 'env-secret' });

    runWithCredentials({ apiKey: 'scoped-key', apiSecret: 'scoped-secret' }, () => {
      expect(getCredentials()).toEqual({ apiKey: 'scoped-key', apiSecret: 'scoped-secret' });
    });

    // Scoped creds must not leak outside runWithCredentials
    expect(getCredentials()).toEqual({ apiKey: 'env-key', apiSecret: 'env-secret' });
  });

  it('returns null when neither scope nor env set', () => {
    expect(getCredentials()).toBeNull();
  });

  it('returns null when only apiKey is set without apiSecret', () => {
    process.env.HUNTRESS_API_KEY = 'key-only';
    expect(getCredentials()).toBeNull();
  });

  it('returns null when only apiSecret is set without apiKey', () => {
    process.env.HUNTRESS_API_SECRET = 'secret-only';
    expect(getCredentials()).toBeNull();
  });

  it('ALS scope does not leak into sibling async paths', async () => {
    const results: Array<{ apiKey: string; apiSecret: string } | null> = [];

    const runA = () =>
      runWithCredentials({ apiKey: 'tenant-a', apiSecret: 'secret-a' }, async () => {
        await Promise.resolve(); // yield
        results.push(getCredentials());
      });

    const runB = () =>
      runWithCredentials({ apiKey: 'tenant-b', apiSecret: 'secret-b' }, async () => {
        await Promise.resolve(); // yield
        results.push(getCredentials());
      });

    await Promise.all([runA(), runB()]);

    expect(results).toHaveLength(2);
    expect(results).toContainEqual({ apiKey: 'tenant-a', apiSecret: 'secret-a' });
    expect(results).toContainEqual({ apiKey: 'tenant-b', apiSecret: 'secret-b' });
  });
});
