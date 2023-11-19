import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const devEnv = {
  production: false,
  environmentName: 'development',
  domainUrl: 'https://localhost:4200',
  auth0: {
    domain: 'AUTH-DOMAIN.com',
    clientId: 'abc',
    redirectUri: window.location.origin,
  },
};
