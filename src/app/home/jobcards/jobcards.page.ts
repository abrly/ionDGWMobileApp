import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { JobcardService } from './jobcard.service';
import { JobCard } from './jobcard.model';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import { FilterswitcherPage } from './filterswitcher/filterswitcher.page';
import { filter , switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Platecode } from '../appointments/models/platecode.model'; 
import { AppointmentService } from '../appointments/appointment.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

//import * as internal from 'events';

@Component({
  selector: 'app-jobcards',
  templateUrl: './jobcards.page.html',
  styleUrls: ['./jobcards.page.scss'],
})
export class JobcardsPage implements OnInit, OnDestroy {
  form: FormGroup;
  lang: string;
  isLoading: boolean;
  selectedStatus: string;
  recordsFound: boolean;
  loadedUserToken: string;
  jobcards: JobCard[];
  jobcardsSnapshot: JobCard[];
  searchText: string;
  showFilter = false;
  frmDate: any;
  toDate: any;
  jobcardStatus: any;
  heading1: string;
  ActiveJobCards: string;
  ALLJobCards: string;
  SearchFilters: string;
  FromDate: string;
  FromDatePlaceholder: string;
  ToDate: string;
  ToDatePlaceholder: string;
  SelectStatus: string;
  SelectStatusPlaceholder: string;
  Search: string;
  Filterworkorders: string;
  Norecordsfound: string;
  ALL: string;
  Pending: string;
  Completed: string;
  Closed: string;
  Dismiss: string;
  PleaseWait: string;

  isFirstLoad: boolean;
  pageNumber = 1;
  recsCount:number=0;
  loadedRecsLength:number=0;

  cancelText: string;
  doneText: string;

  filterWithWO:boolean;
  filterWithPN:boolean;

  clickHerefilterTextForWO:string;
  clickHerefilterTextForPN:string;
  placeHolderFilterPN:string;

  preferredFilterOption:string;

  isPendingLoad:boolean;
  status:string;

  searchby:string;
  jobcardnoSearchText:string;
  plateNoSearchText:string;
  activelistrefinedbySearch:string;

  plateCodePH:string; 
  platecodes:Platecode[];


  ByDate:string;
  ByJobCardNo:string;
  ByPlateNo:string;
  FilterByJobCardNo:string;
  FilterByPlateNo:string;
  JobCardNumber:string;
  plateNo:string;

  heading1SearchJobCards:string;
  heading1ActiveJobCards:string;
  Ok:string;
  imageURL:string;
  

  private authUsr: Subscription;
  private jcsSelectSub: Subscription;
  private subAppLang: Subscription;
  private jcsSearchFilterSub: Subscription;
  

  constructor(private authService: AuthService , private jobcardService: JobcardService,
              public loadingController: LoadingController , public translate: TranslateService,
              private popoverController:PopoverController,private activatedRoute: ActivatedRoute,private appointmentService:AppointmentService,private router: Router) {



  }

  ngOnInit() {

    this.form = new FormGroup({     
      platecode: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      plateno: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })     
    });

    this.status = this.activatedRoute.snapshot.params['status'];   
    
    this.filterWithWO=true;
    this.filterWithPN=false;

    this.isLoading = false;

    this.loadJobCardsData();

    this.activelistrefinedbySearch="false";

  }

  loadJobCardsData(){       

    if (this.status==='active'){

      this.searchby='byJobCard';

      this.imageURL='../assets/icon/filter_by_JC_no.png';

     // this.heading1=this.heading1ActiveJobCards;


      this.authUsr = this.authService.token
      .pipe(
       filter(response => !!response),
       switchMap(response => {
       this.loadedUserToken = response;
       return this.appointmentService.getPlateCodes(this.loadedUserToken);
       })
       ).subscribe((response) => {
         this.platecodes = response;
         this.isPendingLoad = true;
         this.loadPendingJobCardsExt(false, '');
       });
  


    } else if (this.status==='all'){

      this.searchby='bydate';

      this.imageURL='../assets/icon/search_byDATE.png';

     // this.heading1=this.heading1SearchJobCards;

      this.authUsr = this.authService.token
      .pipe(
       filter(response => !!response),
       switchMap(response => {
       this.loadedUserToken = response;
       return this.appointmentService.getPlateCodes(this.loadedUserToken);
       })
       ).subscribe((response) => {
         this.platecodes = response;
        
         var dtF = new Date();

         dtF.setDate(dtF.getDate() - 7);
     
         this.frmDate = dtF.toISOString();
     
         this.toDate = new Date().toISOString();
     
         this.jobcardStatus = 'ALL';
   
         this.isPendingLoad=false;
         this.showFilter = true;
         this.jobcards = null;
         this.onSearchJobCards(false, '');

       });

     
    }

  }

  ionViewDidEnter(): void {
    this.getUserLanguage();
  }

  getUserLanguage() {



    this.subAppLang = this.jobcardService.PreferredFilterOption
                   .pipe(
                    filter(response => !!response),
                    switchMap(response => {
                    this.preferredFilterOption = response;  
                    return this.authService.userLang;
                    })              
                    ).subscribe((response) => {
                        this._initTranslate(response);
                    });

   

  }

  _initTranslate(language) {
    this.translate.setDefaultLang('en');
    if (language) {
      this.lang = language;
    } else {
        this.lang = 'en';
    }
    this._translateLanguage();
  }
  
  _translateLanguage(): void {
    this.translate.use(this.lang);
    this._initialiseTranslation();
  }
  
  _initialiseTranslation(): void {

  /*  this.translate.get('jobcards.heading1').subscribe((res: string) => {
      this.heading1 = res;
    }); */

    this.translate.get('jobcards.ActiveJobCards').subscribe((res: string) => {
      this.ActiveJobCards = res;
    });
    this.translate.get('jobcards.ALLJobCards').subscribe((res: string) => {
      this.ALLJobCards = res;
    });
    this.translate.get('jobcards.SearchFilters').subscribe((res: string) => {
      this.SearchFilters = res;
    });
    this.translate.get('jobcards.FromDate').subscribe((res: string) => {
      this.FromDate = res;
    });
    this.translate.get('jobcards.FromDatePlaceholder').subscribe((res: string) => {
      this.FromDatePlaceholder = res;
    });
    this.translate.get('jobcards.ToDate').subscribe((res: string) => {
      this.ToDate = res;
    });
    this.translate.get('jobcards.ToDatePlaceholder').subscribe((res: string) => {
      this.ToDatePlaceholder = res;
    });
    this.translate.get('jobcards.SelectStatus').subscribe((res: string) => {
      this.SelectStatus = res;
    });
    this.translate.get('jobcards.SelectStatusPlaceholder').subscribe((res: string) => {
      this.SelectStatusPlaceholder = res;
    });
    this.translate.get('jobcards.Search').subscribe((res: string) => {
      this.Search = res;
    });
    this.translate.get('jobcards.Filterworkorders').subscribe((res: string) => {
      this.Filterworkorders = res;
    });
    this.translate.get('jobcards.Norecordsfound').subscribe((res: string) => {
      this.Norecordsfound = res;
    });
    this.translate.get('jobcards.ALL').subscribe((res: string) => {
      this.ALL = res;
    });
    this.translate.get('jobcards.Pending').subscribe((res: string) => {
      this.Pending = res;
    });
    this.translate.get('jobcards.Completed').subscribe((res: string) => {
      this.Completed = res;
    });
    this.translate.get('jobcards.Closed').subscribe((res: string) => {
      this.Closed = res;
    });
    this.translate.get('jobcards.Dismiss').subscribe((res: string) => {
      this.Dismiss = res;
    });

    this.translate.get('jobcards.PleaseWait').subscribe((res: string) => {
      this.PleaseWait = res;
    });

    this.translate.get('jobcards.cancelText').subscribe((res: string) => {
      this.cancelText = res;
    });

    this.translate.get('jobcards.doneText').subscribe((res: string) => {
      this.doneText = res;
    });

    this.translate.get('jobcards.clickHerefilterTextForWO').subscribe((res: string) => {
      this.clickHerefilterTextForWO = res;
    });

    this.translate.get('jobcards.clickHerefilterTextForPN').subscribe((res: string) => {
      this.clickHerefilterTextForPN = res;
    });

    this.translate.get('jobcards.placeHolderFilterPN').subscribe((res: string) => {
      this.placeHolderFilterPN = res;
    });


    this.translate.get('jobcards.ByDate').subscribe((res: string) => {
      this.ByDate= res;
    });

    this.translate.get('jobcards.ByJobCardNo').subscribe((res: string) => {
      this.ByJobCardNo = res;
    });


    this.translate.get('jobcards.ByPlateNo').subscribe((res: string) => {
      this.ByPlateNo = res;
    });

    this.translate.get('jobcards.JobCardNumber').subscribe((res: string) => {
      this.JobCardNumber = res;
    });

    this.translate.get('jobcards.plateCodePH').subscribe((res: string) => {
      this.plateCodePH = res;
    });

    this.translate.get('jobcards.plateNo').subscribe((res: string) => {
      this.plateNo = res;
    });


    this.translate.get('jobcards.heading1ActiveJobCards').subscribe((res: string) => {
      this.heading1ActiveJobCards = res;
    }); 

    this.translate.get('jobcards.heading1SearchJobCards').subscribe((res: string) => {
      this.heading1SearchJobCards = res;
    }); 


    if (this.status==='active'){   

      this.heading1=this.heading1ActiveJobCards;

    } else {

      this.heading1=this.heading1SearchJobCards;
    }

    this.translate.get('jobcards.FilterByJobCardNo').subscribe((res: string) => {
      this.FilterByJobCardNo = res;
    });


    this.translate.get('jobcards.FilterByPlateNo').subscribe((res: string) => {
      this.FilterByPlateNo = res;
    });
   
    this.translate.get('jobcards.Ok').subscribe((res: string) => {
      this.Ok = res;
    });
   

  }


 

  initializeItems() {
    this.jobcards = [...this.jobcardsSnapshot];    
}

onSearchPlateNo(ev: CustomEvent) {

  this.initializeItems();
  const val = ev.detail.value;

  if (val && val.trim() !== '') {
        this.jobcards = this.jobcards.filter(term => {
          return term.EQLicense.replace('-','').trim().toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
        });
      } else {
        return null;
      }
}

onSwitchToWOFilter(){  
  this.filterWithPN=false;
  this.filterWithWO =true;
}

onSwitchToPNFilter(){  
  this.filterWithPN=true;
  this.filterWithWO =false;
}

  onSearchTerm(ev: CustomEvent) {

    this.initializeItems();
    const val = ev.detail.value;

    if (val && val.trim() !== '') {
          this.jobcards = this.jobcards.filter(term => {
            return term.WorkOrderID.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
          });
        } else {
          return null;
    }
}


onSearchJobCardsByID(searchText:string){
  const val = searchText;
  if (val!=undefined){
    this.jobcards=[];
    this.jobcardsSnapshot=[];  
    this.onSearchByJobCardNo(val);
  } 
} 


onSearchByJobCardNo(searchText: string) { 

  let statusText='';
  if (this.status==='all'){
    statusText='ALL';
  } else if (this.status==='active'){
    this.activelistrefinedbySearch="true";
    statusText='OPEN';
  }

  
  this.pageNumber = 1;
  this.jobcards = [];
  this.jobcardsSnapshot = [];  


    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: this.PleaseWait })
      .then(loadingEl => {
        loadingEl.present();
        this.jcsSelectSub = this.jobcardService.GetJobCardsByStatusJobCard(this.loadedUserToken,statusText,searchText.trim()).subscribe(jcs => {      

          this.jobcards = this.jobcards || [];
          this.jobcardsSnapshot = this.jobcardsSnapshot || [];
             
          for (const rw of jcs) {
            this.jobcards.push(rw);
            this.jobcardsSnapshot.push(rw);
          }

          
        if (this.jobcards.length > 0) {
          this.recordsFound = true;
        } else {
          this.recordsFound = false;
          
          this.jobcards=[];
          this.jobcardsSnapshot=[];
        }

        this.isLoading = false;

        loadingEl.dismiss();
     
          });
       });

}

/*
onSearchByPlateNo(searchText:string) {   

    const val = searchText;

    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: this.PleaseWait })
      .then(loadingEl => {
        loadingEl.present();
        this.jcsSelectSub = this.jobcardService.GetJobCardsByStatusPlateNo(this.loadedUserToken,'ALL',val.trim()).subscribe(jcs => {      

          this.jobcards = this.jobcards || [];
          this.jobcardsSnapshot = this.jobcardsSnapshot || [];
             
          for (const rw of jcs) {
            this.jobcards.push(rw);
            this.jobcardsSnapshot.push(rw);
          }

          
        if (this.jobcards.length > 0) {
          this.recordsFound = true;
        } else {
          this.recordsFound = false;   
          
          this.jobcards=[];
          this.jobcardsSnapshot=[];
          
        }

        this.isLoading = false;

        loadingEl.dismiss();

     
          });
       });
     
} */


searchsegmentChanged(evt: any){

//  this.segmentclicked='y';

  
 
  const selectedSegment = evt.detail.value;
  
  //this.pageNumber = 1;
  //this.jobcards = [];
  //this.jobcardsSnapshot = [];  

  this.jobcardnoSearchText=null;

  this.form.reset();

  if (selectedSegment === 'bydate') {
    
    this.searchby='bydate';
    this.imageURL='../assets/icon/search_byDATE.png';
  

  } else if (selectedSegment === 'byJobCard') {

    this.searchby='byJobCard';
    this.imageURL='../assets/icon/filter_by_JC_no.png';
    
  } else if (selectedSegment === 'byPlateNo') {

    this.searchby='byPlateNo';
    this.imageURL='../assets/icon/filter_by_JC_PLATEno.png';
    
  } 

}

searchsegmentChangedExt(evt: any){

  //  this.segmentclicked='y';
  
   
    const selectedSegment = evt.detail.value;
    
    //this.pageNumber = 1;
    //this.jobcards = [];
    //this.jobcardsSnapshot = [];  
  
    this.jobcardnoSearchText=null;
  
    this.form.reset();
  
    if (selectedSegment === 'bydate') {
      
      this.searchby='bydate';
  
    
  
    } else if (selectedSegment === 'byJobCard') {
  
      this.searchby='byJobCard';
     
      
    } else if (selectedSegment === 'byPlateNo') {
  
      this.searchby='byPlateNo';
     
      
    } 
  
  }

/*
segmentChanged(evt: any) {

  const selectedSegment = evt.detail.value;

  if (selectedSegment === 'all') {
      this.isPendingLoad=false;
      this.showFilter = true;
      this.jobcards = null;
      this.onSearchJobCards(false, '');
  } else if (selectedSegment === 'active') {
    this.isPendingLoad=true;
    this.showFilter = false;    
    this.loadPendingJobCardsExt(false, '');
  } else if (selectedSegment === 'carsearch') {
    this.isPendingLoad=false;
    this.showFilter = false;    
   // this.loadPendingJobCardsExt(false, '');
  }
  
  
} */

/*
loadPendingJobCards() {
  this.isLoading = true;
  this.loadingController
    .create({ keyboardClose: true, message: this.PleaseWait })
    .then(loadingEl => {
      loadingEl.present();
      this.jcsSelectSub = this.jobcardService.GetJobCards(this.loadedUserToken,  'OPEN').subscribe(jcs => {
        this.jobcards = jcs;
        this.jobcardsSnapshot = jcs;
        if (jcs.length > 0) {
          this.recordsFound = true;
        } else {
          this.recordsFound = false;
        }
        this.isLoading = false;
        loadingEl.dismiss();
      });
    });
} */


loadPendingJobCardsExt(firstLoad: boolean, evt: any) {

  if (firstLoad === false) {
    this.pageNumber = 1;
    this.jobcards = [];
    this.jobcardsSnapshot = [];  
   }

  this.isLoading = true;
  this.loadingController
    .create({ keyboardClose: true, message: this.PleaseWait })
    .then(loadingEl => {
      loadingEl.present();
      this.jcsSelectSub = this.jobcardService.GetJobCards(this.loadedUserToken,  'OPEN',this.pageNumber).subscribe(jcs => {
       
      //  this.jobcards = jcs;
      //  this.jobcardsSnapshot = jcs;


        this.jobcards = this.jobcards || [];
        this.jobcardsSnapshot = this.jobcardsSnapshot || [];
           
        for (const rw of jcs) {
          this.jobcards.push(rw);
          this.jobcardsSnapshot.push(rw);
        }

        if (this.jobcards.length > 0) {
          this.recordsFound = true;

          this.loadedRecsLength = this.jobcards.length;
          this.recsCount=this.jobcards[0].TotalRecsCount;


        } else {
          this.recordsFound = false;
          this.loadedRecsLength =0;
          this.recsCount=0;
        }

        this.isLoading = false;
        this.isFirstLoad = firstLoad;

        if (this.isFirstLoad) {
          evt.target.complete();
          }
      
          this.pageNumber++;

        loadingEl.dismiss();

      });
    });
}


onSearchJobCards(firstLoad: boolean, evt: any) {

 let searchFrom: any;
 let searchTo: any;

 if (firstLoad === false) {
  this.pageNumber = 1;
  this.jobcards = [];
  this.jobcardsSnapshot = [];
 }


 const fromDt = this.frmDate.split('T')[0];
 const toDt = this.toDate.split('T')[0];

 const frmDateArray = fromDt.split('-');

 searchFrom = frmDateArray[1] + '-' + frmDateArray[2] + '-' + frmDateArray[0];

 const toDateArray = toDt.split('-');
 searchTo = toDateArray[1] + '-' + toDateArray[2] + '-' + toDateArray[0];





 this.isLoading = true;
 this.loadingController.create({ keyboardClose: true, message: this.PleaseWait })
  .then(loadingEl => {
  loadingEl.present();
  this.jcsSearchFilterSub = this.jobcardService.GetJobCardsViaSearchFilters
  (this.loadedUserToken, this.jobcardStatus, searchFrom.slice(0, 10), searchTo.slice(0, 10), this.pageNumber)
  .subscribe(jcs => {

    

    this.jobcards = this.jobcards || [];
    this.jobcardsSnapshot = this.jobcardsSnapshot || [];

   
    for (const rw of jcs) {
      this.jobcards.push(rw);
      this.jobcardsSnapshot.push(rw);
  }

    if (this.jobcards.length > 0) {
          this.recordsFound = true;

          this.loadedRecsLength = this.jobcards.length;
          this.recsCount=this.jobcards[0].TotalRecsCount;

        //  console.log('whatisrecscount');
        //  console.log(this.recsCount);
        //  console.log(this.loadedRecsLength);

          } else {
            this.recordsFound = false;
            this.loadedRecsLength =0;
            this.recsCount=0;
          }

    this.isLoading = false;

    this.isFirstLoad = firstLoad;

   // console.log('what in');
    //console.log(this.jobcards);


    if (this.isFirstLoad) {
    evt.target.complete();
    }

    this.pageNumber++;

    loadingEl.dismiss();

    });
    
  });


}


doInfinite(event) {
  /*if (this.searchby==='bydate'){
   this.isFirstLoad = true;
   if (this.isPendingLoad){
    this.loadPendingJobCardsExt(this.isFirstLoad, event);    
   } else{
    this.onSearchJobCards(this.isFirstLoad, event);
   }
  }*/


  if (this.status ==='active'){
    this.isFirstLoad = true;
    if (this.isPendingLoad){
     this.loadPendingJobCardsExt(this.isFirstLoad, event);    
    }
   }

  if (this.searchby==='bydate'){
    this.isFirstLoad = true;  
     this.onSearchJobCards(this.isFirstLoad, event);    
   }

}


async presentPopover(ev: any) {
  const popover = await this.popoverController.create({
    component: FilterswitcherPage,
    cssClass: 'custom-popover',
    event: ev,
    translucent: true,
    componentProps: {
      selfltr: this.preferredFilterOption,
      lang:this.lang
    }
  });
  return await popover.present();

}


onSearchVehicleByPlateNo(){

  if (!this.form.valid) {
    return;
  }

  this.pageNumber = 1;
  this.jobcards = [];
  this.jobcardsSnapshot = [];  
 
  const fullPlateNo = this.form.value.platecode + '-' + this.form.value.plateno;   

  let statusText='';
  if (this.status==='all'){
    statusText='ALL';
  } else if (this.status==='active'){
    this.activelistrefinedbySearch="true";
    statusText='OPEN';
  }

  

  this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: this.PleaseWait })
      .then(loadingEl => {
        loadingEl.present();
        this.jcsSelectSub = this.jobcardService.GetJobCardsByStatusPlateNo(this.loadedUserToken,statusText,fullPlateNo.trim()).subscribe(jcs => {      

          this.jobcards = this.jobcards || [];
          this.jobcardsSnapshot = this.jobcardsSnapshot || [];
             
          for (const rw of jcs) {
            this.jobcards.push(rw);
            this.jobcardsSnapshot.push(rw);
          }

          
        if (this.jobcards.length > 0) {
          this.recordsFound = true;
        } else {
          this.recordsFound = false;   
          
          this.jobcards=[];
          this.jobcardsSnapshot=[];
          
        }

        this.isLoading = false;

        loadingEl.dismiss();

     
          });
       });

}

/*
getMyWorkLogs(itm:any){


  console.log(itm);


  
    this.router.navigate(['/home/jobcards/' + this.loadedUserToken + '/' + itm.WorkOrderID + '/' + itm.EquipmentNo]);

  

}*/


  ngOnDestroy() {

    if (this.authUsr) {
      this.authUsr.unsubscribe();
    }

    if (this.jcsSelectSub) {
      this.jcsSelectSub.unsubscribe();
    }

    if (this.jcsSearchFilterSub) {
      this.jcsSearchFilterSub.unsubscribe();
    }

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }

  }




}
