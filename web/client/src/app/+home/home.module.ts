import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { Routing } from './home.routing';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        CommonModule,
        Routing,
        MaterialModule,
    ],
    exports: [
    ],
    declarations: [
        HomeComponent,
    ],
})
export class HomeModule {
}
