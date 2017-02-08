import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfoComponent } from './info.component';

const ROUTES: Routes = [
  { path: '', component: InfoComponent}
];
export const Routing: ModuleWithProviders = RouterModule.forChild(ROUTES);
