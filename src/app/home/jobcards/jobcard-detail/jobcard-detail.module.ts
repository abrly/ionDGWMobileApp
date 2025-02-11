import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JobcardDetailPageRoutingModule } from './jobcard-detail-routing.module';
import { JobcardDetailPage } from './jobcard-detail.page';
import { WorklogComponent } from './worklog/worklog.component';
import { StatuslogComponent } from './statuslog/statuslog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobcardDetailPageRoutingModule
  ],
  declarations: [JobcardDetailPage, WorklogComponent,StatuslogComponent]
})
export class JobcardDetailPageModule {}
