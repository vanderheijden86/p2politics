import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { SideMenuComponent } from './side-menu.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
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
