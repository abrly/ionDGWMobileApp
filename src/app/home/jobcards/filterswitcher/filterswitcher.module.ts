import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterswitcherPageRoutingModule } from './filterswitcher-routing.module';

//import { FilterswitcherPage } from './filterswitcher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterswitcherPageRoutingModule
  ],
  declarations: []
})
export class FilterswitcherPageModule {}
