import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MdCardModule,
    MdToolbarModule,
    MdIconModule,
    MdButtonToggleModule,
    MdButtonModule,
    MdInputModule
} from '@angular/material';

import { SharedModule } from '../shared';

import { ProposalRouting } from './routing';

import { ProposalOverviewComponent } from './overview/proposal-overview.component';
import { ProposalDetailComponent } from './detail/proposal-detail.component';
import { ProposalAddComponent } from './add/proposal-add.component';
import { InputErrorComponent } from './add/input-error.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MdCardModule,
        MdToolbarModule,
        MdIconModule,
        MdButtonToggleModule,
        MdButtonModule,
        MdInputModule,
        SharedModule,
        ProposalRouting,
    ],
    declarations: [
        ProposalOverviewComponent,
        ProposalDetailComponent,
        ProposalAddComponent,
        InputErrorComponent
    ]
})
export class ProposalModule { }
