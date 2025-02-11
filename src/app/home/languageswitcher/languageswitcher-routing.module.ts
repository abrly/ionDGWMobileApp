import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguageswitcherPage } from './languageswitcher.page';

const routes: Routes = [
  {
    path: '',
    component: LanguageswitcherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LanguageswitcherPageRoutingModule {}
