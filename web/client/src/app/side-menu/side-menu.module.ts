import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { SideMenuComponent } from './side-menu.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        SideMenuComponent,
    ],
    declarations: [
        SideMenuComponent,
    ],
})
export class SideMenuModule {
}
