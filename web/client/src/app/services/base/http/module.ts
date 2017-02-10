import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';

import { BaseServiceAgent } from './base.service-agent';

@NgModule({
    imports: [HttpModule]
})
export class BaseHttpModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BaseHttpModule,
            providers: [BaseServiceAgent]
        };
    }
}
