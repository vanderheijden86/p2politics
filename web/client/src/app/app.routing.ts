import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '', loadChildren: './+home/home.module#HomeModule' },
    { path: 'domain/:domainId', loadChildren: './+proposal/module/#ProposalModule' },
    { path: 'info', loadChildren: './+info/info.module#InfoModule' },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(ROUTES);
