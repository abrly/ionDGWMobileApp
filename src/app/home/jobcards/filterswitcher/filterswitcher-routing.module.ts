import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterswitcherPage } from './filterswitcher.page';

const routes: Routes = [
  {
    path: '',
    component: FilterswitcherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterswitcherPageRoutingModule {}
