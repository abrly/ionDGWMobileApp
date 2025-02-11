import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmappointmentPage } from './confirmappointment.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmappointmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmappointmentPageRoutingModule {}
