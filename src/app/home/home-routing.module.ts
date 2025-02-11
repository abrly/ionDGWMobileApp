import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedbacksPage } from './feedbacks/feedbacks.page';

import { HomePage } from './home.page';
import { JobcardsPage } from './jobcards/jobcards.page';


const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'jobcards',
    loadChildren: () => import('./jobcards/jobcards.module').then( m => m.JobcardsPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedbacks/feedbacks.module').then( m => m.FeedbacksPageModule)
  },
  {
    path: 'profileupdate',
    loadChildren: () => import('./updateuser/updateuser.module').then( m => m.UpdateuserPageModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./appointments/appointments.module').then( m => m.AppointmentsPageModule)
  },   {
    path: 'vehicleinfo',
    loadChildren: () => import('./vehicleinfo/vehicleinfo.module').then( m => m.VehicleinfoPageModule)
  }
 
];





const routess: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'jobcards',
    component: JobcardsPage
  },
  {
    path: 'feedback',
    component: FeedbacksPage
  },

];

const routesw: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'jobcards',
        children: [
          {
            path: '',
            loadChildren: () => import('./jobcards/jobcards.module').then(m => m.JobcardsPageModule)
          }
        ]
      }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
