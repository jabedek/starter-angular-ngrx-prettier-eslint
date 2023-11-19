import { devEnv } from './environment.dev';

const env: Partial<typeof devEnv> = {
  production: false,
  environmentName: 'tests',
  domainUrl: 'https://HOSTING-TESTS.pl',
  auth0: {
    domain: 'AUTH-DOMAIN.com',
    clientId: 'xyz',
    redirectUri: window.location.origin,
  },
};

// Export all settings of common replaced by dev options
export const environment = { ...devEnv, ...env };
