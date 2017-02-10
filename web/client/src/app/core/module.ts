import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppConfig } from './app.config';
import { HttpConfig } from './http.config';

@NgModule({})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [AppConfig, HttpConfig]
        };
    }
}
