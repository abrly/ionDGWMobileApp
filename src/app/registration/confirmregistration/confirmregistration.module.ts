import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmregistrationPageRoutingModule } from './confirmregistration-routing.module';

import { ConfirmregistrationPage } from './confirmregistration.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ConfirmregistrationPageRoutingModule
  ],
  declarations: [ConfirmregistrationPage]
})
export class ConfirmregistrationPageModule {}
