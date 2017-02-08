import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { Routing } from './info.routing';
import { InfoComponent } from './info.component';

@NgModule({
    imports: [
        CommonModule,
        Routing,
        MaterialModule,
    ],
    exports: [
    ],
    declarations: [
        InfoComponent,
    ],
})
export class InfoModule {
}
