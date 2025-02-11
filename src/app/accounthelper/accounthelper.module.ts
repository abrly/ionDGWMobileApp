import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccounthelperPageRoutingModule } from './accounthelper-routing.module';
import { AccounthelperPage } from './accounthelper.page';
import { VerifyuserOTPComponent } from './verifyuser-otp/verifyuser-otp.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    AccounthelperPageRoutingModule,
  ],
  declarations: [AccounthelperPage, VerifyuserOTPComponent ]
  //,entryComponents: [VerifyuserOTPComponent],
  })
export class AccounthelperPageModule {}
