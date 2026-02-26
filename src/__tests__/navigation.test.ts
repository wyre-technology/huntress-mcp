import { describe, it, expect } from 'vitest';
import { getState, getNavigationTools, getBackTool, DOMAINS } from '../domains/navigation.js';

describe('Navigation', () => {
  it('should return null domain initially', () => {
    const state = getState('test-1');
    expect(state.currentDomain).toBeNull();
  });

  it('should track domain state', () => {
    const state = getState('test-2');
    state.currentDomain = 'agents';
    expect(getState('test-2').currentDomain).toBe('agents');
  });

  it('should isolate sessions', () => {
    const s1 = getState('test-3');
    const s2 = getState('test-4');
    s1.currentDomain = 'billing';
    expect(s2.currentDomain).toBeNull();
  });

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

  it('should return back tool', () => {
    const tool = getBackTool();
    expect(tool.name).toBe('huntress_back');
  });
});
