import type { DomainName, DomainHandler } from '../utils/types.js';

const domainCache = new Map<DomainName, DomainHandler>();

export async function getDomainHandler(domain: DomainName): Promise<DomainHandler> {
  const cached = domainCache.get(domain);
  if (cached) return cached;

  let handler: DomainHandler;
  switch (domain) {
    case 'accounts': {
      const { accountsHandler } = await import('./accounts.js');
      handler = accountsHandler;
      break;
    }
    case 'agents': {
      const { agentsHandler } = await import('./agents.js');
      handler = agentsHandler;
      break;
    }
    case 'organizations': {
      const { organizationsHandler } = await import('./organizations.js');
      handler = organizationsHandler;
      break;
    }
    case 'incidents': {
      const { incidentsHandler } = await import('./incidents.js');
      handler = incidentsHandler;
      break;
    }
    case 'billing': {
      const { billingHandler } = await import('./billing.js');
      handler = billingHandler;
      break;
    }
    case 'signals': {
      const { signalsHandler } = await import('./signals.js');
      handler = signalsHandler;
      break;
    }
    case 'users': {
      const { usersHandler } = await import('./users.js');
      handler = usersHandler;
      break;
    }
    default:
      throw new Error(`Unknown domain: ${domain}`);
  }

  domainCache.set(domain, handler);
  return handler;
}
