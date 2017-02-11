import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProposalOverviewComponent } from './overview/proposal-overview.component';
import { ProposalDetailComponent } from './detail/proposal-detail.component';
import { ProposalAddComponent } from './add/proposal-add.component';

const PROPOSAL_ROUTES: Routes = [
    { path: '', component: ProposalOverviewComponent },
    { path: 'proposal/add', component: ProposalAddComponent },
    { path: 'proposal/add/:iterationId', component: ProposalAddComponent },
    { path: 'proposal/:proposalId', component: ProposalDetailComponent }
];
export const ProposalRouting: ModuleWithProviders = RouterModule.forChild(PROPOSAL_ROUTES);
