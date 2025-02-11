import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JobcardsPageRoutingModule } from './jobcards-routing.module';
import { JobcardsPage } from './jobcards.page';
import { JobcarditemComponent } from './jobcarditem/jobcarditem.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    JobcardsPageRoutingModule,
    ],
  declarations: [JobcardsPage, JobcarditemComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class JobcardsPageModule {}
