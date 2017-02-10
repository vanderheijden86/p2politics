import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';

const ROUTES: Routes = [
  { path: '', component: HomeComponent }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(ROUTES);
