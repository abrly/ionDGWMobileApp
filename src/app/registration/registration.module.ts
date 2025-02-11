import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistrationPageRoutingModule } from './registration-routing.module';
import { RegistrationPage } from './registration.page';
import { VerifyregistrationComponent } from './verifyregistration/verifyregistration.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RegistrationPageRoutingModule,
  ],
  declarations: [RegistrationPage, VerifyregistrationComponent]
  // entryComponents: [VerifyregistrationComponent]
})
export class RegistrationPageModule {}
