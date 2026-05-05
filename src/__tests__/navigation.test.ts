import { describe, it, expect } from 'vitest';
import { getNavigationTools, DOMAINS } from '../domains/navigation.js';

describe('Navigation', () => {
  it('should have all domains', () => {
    expect(DOMAINS).toContain('accounts');
    expect(DOMAINS).toContain('agents');
    expect(DOMAINS).toContain('organizations');
    expect(DOMAINS).toContain('incidents');
    expect(DOMAINS).toContain('billing');
    expect(DOMAINS).toContain('signals');
    expect(DOMAINS).toContain('users');
  });

  it('should return navigation tools', () => {
    const tools = getNavigationTools();
    expect(tools).toHaveLength(2);
    expect(tools[0].name).toBe('huntress_navigate');
    expect(tools[1].name).toBe('huntress_status');
  });

  it('should have stateless navigate tool description', () => {
    const tools = getNavigationTools();
    const navigateTool = tools.find(t => t.name === 'huntress_navigate');
    expect(navigateTool?.description).toContain('All tools are callable at any time');
  });
});
