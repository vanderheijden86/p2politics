import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MdCardModule, MdToolbarModule, MdIconModule, MdButtonToggleModule, MdButtonModule } from '@angular/material';

import { SharedModule } from '../shared';

import { ProposalRouting } from './routing';

import { ProposalOverviewComponent } from './overview/proposal-overview.component';
import { ProposalDetailComponent } from './detail/proposal-detail.component';

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
        SharedModule,
        ProposalRouting,
    ],
    declarations: [
        ProposalOverviewComponent,
        ProposalDetailComponent
    ]
})
export class ProposalModule { }
