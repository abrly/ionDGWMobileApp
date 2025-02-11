import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UpdateuserPageRoutingModule } from './updateuser-routing.module';
import { UpdateuserPage } from './updateuser.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    UpdateuserPageRoutingModule
  ],
  declarations: [UpdateuserPage]
})
export class UpdateuserPageModule {}
