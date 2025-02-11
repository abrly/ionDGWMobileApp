import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmappointmentPageRoutingModule } from './confirmappointment-routing.module';

import { ConfirmappointmentPage } from './confirmappointment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ConfirmappointmentPageRoutingModule
  ],
  declarations: [ConfirmappointmentPage],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConfirmappointmentPageModule {}
