import { NgModule, ModuleWithProviders } from '@angular/core';

import { BaseMapper } from './base.mapper';
import { BrowserLocationService } from './browser-location.service';
import { BrowserStorageService } from './browser-storage.service';
import { ObjectUtils } from './object.utils';

@NgModule({})
export class BaseUtilsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BaseUtilsModule,
            providers: [BaseMapper, BrowserLocationService, BrowserStorageService, ObjectUtils]
        };
    }
}
