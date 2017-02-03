import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './info.routing';
import { InfoComponent } from './info.component';

@NgModule({
    imports: [
        CommonModule,
        routing,
    ],
    exports: [
    ],
    declarations: [
        InfoComponent,
    ],
})
export class InfoModule {
}
