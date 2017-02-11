import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { SharedModule } from '../shared';

import { Routing } from './info.routing';
import { InfoComponent } from './info.component';

@NgModule({
    imports: [
        CommonModule,
        Routing,
        FormsModule,
        MaterialModule,
        SharedModule,
    ],
    exports: [
    ],
    declarations: [
        InfoComponent,
    ],
})
export class InfoModule {
}
