import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
    { path: '', redirectTo: 'info', pathMatch: 'full' },

    { path: 'info', loadChildren: './+info/info.module#InfoModule' },
    { path: 'domain/:domainId', loadChildren: './+proposal/module/#ProposalModule' },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(ROUTES);
