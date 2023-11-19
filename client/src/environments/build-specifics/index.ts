import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ModuleWithProviders } from '@angular/core';

export const extModules: ModuleWithProviders<StoreDevtoolsModule>[] = [
  StoreDevtoolsModule.instrument({
    maxAge: 25,
  }),
];
