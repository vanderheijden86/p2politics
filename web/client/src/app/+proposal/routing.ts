import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProposalOverviewComponent } from './overview/proposal-overview.component';
import { ProposalDetailComponent } from './detail/proposal-detail.component';

const PROPOSAL_ROUTES: Routes = [
    { path: '', component: ProposalOverviewComponent },
    { path: 'proposal/:id', component: ProposalDetailComponent }
];
export const ProposalRouting: ModuleWithProviders = RouterModule.forChild(PROPOSAL_ROUTES);
