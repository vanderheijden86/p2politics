import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MdCardModule, MdToolbarModule, MdIconModule, MdButtonToggleModule } from '@angular/material';

import { ProposalRouting } from './routing';

import { ProposalOverviewComponent } from './overview/proposal-overview.component';
import { ProposalDetailComponent } from './detail/proposal-detail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MdCardModule,
        MdToolbarModule,
        MdIconModule,
        MdButtonToggleModule,
        ProposalRouting,
    ],
    declarations: [
        ProposalOverviewComponent,
        ProposalDetailComponent
    ]
})
export class ProposalModule { }
