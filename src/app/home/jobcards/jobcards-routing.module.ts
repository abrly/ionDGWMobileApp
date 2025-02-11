import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobcardsPage } from './jobcards.page';

const routes: Routes = [
  {
    path: '',
    component: JobcardsPage
  },
  {
    path: ':userToken/:workorderid/:equipmentNo',
    loadChildren: () => import('./jobcard-detail/jobcard-detail.module').then( m => m.JobcardDetailPageModule)
  },
  {
    path: 'filterswitcher',
    loadChildren: () => import('./filterswitcher/filterswitcher.module').then( m => m.FilterswitcherPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobcardsPageRoutingModule {}
