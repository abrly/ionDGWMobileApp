import { Component, OnInit, Input } from '@angular/core';
import { Filteroption } from '../filteroption.model';
import { JobcardService } from '../jobcard.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-filterswitcher',
  templateUrl: './filterswitcher.page.html',
  styleUrls: ['./filterswitcher.page.scss'],
})
export class FilterswitcherPage implements OnInit {
  @Input() selfltr: string;
  @Input() lang:string;
  filterOption: Filteroption[] = [];

  constructor(private popoverController: PopoverController,private jobcardService:JobcardService) { }

  ngOnInit() {

    if (this.lang=='en'){
      this.filterOption.push
      (new Filteroption(1, 'Job Card', '../../../assets/icon/srh_job.png') , new Filteroption(2,  'Plate Number', '../../../assets/icon/srh_plate.png')); 
    }
    else {
      this.filterOption.push
      (new Filteroption(1, 'أمر الصيانة', '../../../assets/icon/srh_job.png') , new Filteroption(2,  'رقم اللوحة', '../../../assets/icon/srh_plate.png')); 
    }
    
  }

  async onSetPreferredFilter(fltr: string) {

    this.jobcardService.setPreferredFilterOption(fltr);

    await this.popoverController.dismiss();

 }

}
