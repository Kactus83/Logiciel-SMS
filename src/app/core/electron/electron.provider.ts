import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, Provider, inject } from '@angular/core';
import { ElectronService } from 'app/core/electron/electron.service';

export const provideElectron = (): Array<Provider | EnvironmentProviders> => {
    return [
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ElectronService),
            multi: true,
        },
    ];
};
