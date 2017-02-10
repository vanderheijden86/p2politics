import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { ProposalRouting } from './routing';

import { ProposalOverviewComponent } from './overview/proposal-overview.component';
import { ProposalDetailComponent } from './detail/proposal-detail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        ProposalRouting,
    ],
    declarations: [
        ProposalOverviewComponent,
        ProposalDetailComponent
    ]
})
export class ProposalModule { }
