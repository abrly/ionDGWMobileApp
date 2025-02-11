import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewappointmentPageRoutingModule } from './newappointment-routing.module';

import { NewappointmentPage } from './newappointment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewappointmentPageRoutingModule
  ],
  declarations: [NewappointmentPage],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NewappointmentPageModule {}
