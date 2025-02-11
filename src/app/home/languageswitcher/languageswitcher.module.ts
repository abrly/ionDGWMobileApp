import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LanguageswitcherPageRoutingModule } from './languageswitcher-routing.module';
import { LanguageswitcherPage } from './languageswitcher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LanguageswitcherPageRoutingModule
  ],
  declarations: [LanguageswitcherPage]
})
export class LanguageswitcherPageModule {}
