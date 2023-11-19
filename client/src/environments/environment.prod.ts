import { devEnv } from './environment.dev';

const env: Partial<typeof devEnv> = {
  production: true,
  environmentName: 'production',
  domainUrl: 'https://HOSTING-PROD.pl',
  auth0: {
    domain: 'AUTH-DOMAIN.com',
    clientId: 'def',
    redirectUri: window.location.origin,
  },
};

// Export all settings of common replaced by dev options
export const environment = { ...devEnv, ...env };
