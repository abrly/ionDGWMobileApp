import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentsPageRoutingModule } from './appointments-routing.module';

import { AppointmentsPage } from './appointments.page';

import { NgCalendarModule  } from 'ionic2-calendar';
import { ViewappointmentComponent } from './viewappointment/viewappointment.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentsPageRoutingModule,
    NgCalendarModule
  ], 
  declarations: [AppointmentsPage,ViewappointmentComponent]
  //,entryComponents: [ViewappointmentComponent],
})
export class AppointmentsPageModule {}
