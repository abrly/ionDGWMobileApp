import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentsPage } from './appointments.page';



const routes: Routes = [
  {
    path: '',
    component: AppointmentsPage
  },
  {
    path: 'newappointment',
    loadChildren: () => import('./newappointment/newappointment.module').then( m => m.NewappointmentPageModule)
  },
  {
    path: 'confirmappointment',
    loadChildren: () => import('./confirmappointment/confirmappointment.module').then( m => m.ConfirmappointmentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsPageRoutingModule {}
