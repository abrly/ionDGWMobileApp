import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewappointmentPage } from './newappointment.page';

const routes: Routes = [
  {
    path: '',
    component: NewappointmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewappointmentPageRoutingModule {}
