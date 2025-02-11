import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FeedbacksPageRoutingModule } from './feedbacks-routing.module';
import { FeedbacksPage } from './feedbacks.page';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FeedbacksPageRoutingModule
  ],
  declarations: [FeedbacksPage]
})
export class FeedbacksPageModule {}
