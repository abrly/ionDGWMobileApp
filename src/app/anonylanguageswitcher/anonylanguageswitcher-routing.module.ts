import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnonylanguageswitcherPage } from './anonylanguageswitcher.page';

const routes: Routes = [
  {
    path: '',
    component: AnonylanguageswitcherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnonylanguageswitcherPageRoutingModule {}
