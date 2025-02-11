import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationPage } from './registration.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationPage
  },
  {
    path: 'confirmregistration/:id',
    loadChildren: () => import('./confirmregistration/confirmregistration.module').then( m => m.ConfirmregistrationPageModule)
  }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationPageRoutingModule {}
