import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { routing } from './info.routing';
import { InfoComponent } from './info.component';

@NgModule({
    imports: [
        CommonModule,
        routing,
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
