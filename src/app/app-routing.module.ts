import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AuthGuard } from '../app/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'reg',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'accounthelper',
    loadChildren: () => import('./accounthelper/accounthelper.module').then( m => m.AccounthelperPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'home/profileupdate',
    loadChildren: () => import('./home/updateuser/updateuser.module').then( m => m.UpdateuserPageModule),
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
   // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
   RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules} )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
