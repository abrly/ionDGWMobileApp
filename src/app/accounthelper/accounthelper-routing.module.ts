import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccounthelperPage } from './accounthelper.page';

const routes: Routes = [
  {
    path: '',
    component: AccounthelperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccounthelperPageRoutingModule {}
