import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleinfoPageRoutingModule } from './vehicleinfo-routing.module';

import { VehicleinfoPage } from './vehicleinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VehicleinfoPageRoutingModule
  ],
  declarations: [VehicleinfoPage],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VehicleinfoPageModule {}
