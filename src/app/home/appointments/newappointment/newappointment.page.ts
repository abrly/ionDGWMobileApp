import { Component, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, switchMap  } from 'rxjs/operators';
import { AlertController,ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Timeslot } from '../models/timeslot.model';
import { AppointmentService } from '../appointment.service';
import { Platecode } from '../models/platecode.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Service_Advisor } from '../models/service_advisor.model';
import { AppointmentType } from '../models/appointmenttype.model';



@Component({
  selector: 'app-newappointment',
  templateUrl: './newappointment.page.html',
  styleUrls: ['./newappointment.page.scss']
  
})
export class NewappointmentPage implements OnInit, OnDestroy {

  bIsCalenderOpened:boolean;

  form: FormGroup;
  lang: any;
  loadedUserToken: string;
  appointmentSubmissionDone: boolean;
  selectedDate:string;
  slotselected:boolean;

  timeSlotAvailable:boolean;

  firstTimeLoad:boolean;

  timeslotNotAvailableMsg:string;

  constructor( private authService: AuthService,private appointmentService:AppointmentService,private alertCtrl: AlertController,
    private router: Router, public translate: TranslateService) { }

  platecodes:Platecode[];
  timeslots:Timeslot[];
  serviceAdvisors:Service_Advisor[];
  appointmentTypes:AppointmentType[];
  
  heading:string;
  appointmentDate:string;
  appointmentDatePH:string;
  timeslot:string;
  timeslotPH:string;
  plateCode:string;
  plateCodePH:string;
  plateNo:string;
  plateNoPH:string;
  goText:string;
  Dismiss:string;
  doneText:string;
  cancelText:string;

  serviceAdvisor:string;
  serviceAdvisorPH:string;

  AppointmentType:string;
  appontmentTypePH:string;

  private authUsr: Subscription;
  private subPlatecodes: Subscription;
  private subTimeslot: Subscription;
  private subTodayTimeslot: Subscription;
  private subAppLang: Subscription;

  showCalendar:boolean=false;
  dtSelectedDisplay:String;
  dtSelectedToMove:String;

  eventSource;

  DGW:string;
  Ok:string;

  ngOnInit() {

    

    this.firstTimeLoad=true;

    this.slotselected=false;

    this.authUsr = this.authService.token
                   .pipe(
                    filter(response => !!response),
                    switchMap(response => {
                    this.loadedUserToken = response;
                       return this.appointmentService.getPlateCodes(this.loadedUserToken);
                    }),
                    filter(response => !!response),
                    switchMap(response => {
                    this.platecodes = response;
                    return this.appointmentService.getServiceAdvisors(this.loadedUserToken);
                    }),                 
                    filter(response => !!response),
                    switchMap(response => {
                      this.serviceAdvisors = response;
                      return this.appointmentService.getAppointmentTypes(this.loadedUserToken,"1")
                    }),
                    ).subscribe((response) => {
                      this.appointmentTypes = response;
                      this.timeSlotAvailable =false;
                      this.showCalendar = true;
                      this.timeslotNotAvailableMsg="";
                    });


   /* this.form = new FormGroup({
      appointmentDate: new FormControl(formatDate(new Date(), "yyyy-MM-dd", "en"), {
        updateOn: 'blur',        
        validators: [Validators.required, Validators.min(1)]
      }),
      timeslot: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      platecode: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      plateno: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      serviceAdvisorId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })
      
     
     
    });*/


    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);


  
    this.form = new FormGroup({
      appointmentDate: new FormControl(formatDate(tomorrow, "yyyy-MM-dd", "en"), {
        updateOn: 'blur',        
        validators: [Validators.required, Validators.min(1)]
      }),
      timeslot: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      platecode: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      plateno: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      serviceAdvisorId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })
      
     
     
    });


    this.dtSelectedToMove=formatDate(tomorrow, "yyyy-MM-dd", "en");

   // const today = new Date()
    
   
   // const aptDate = new Date();
   //  aptDate.setDate(aptDate.getDate() + 1);

   // this.form.get('appointmentDate').setValue(aptDate.toISOString());


  }

  ionViewDidEnter(): void {
    this.getUserLanguage();    
  }

  getUserLanguage() {

    this.subAppLang = this.authService.userLang.subscribe((lang) => {

      this._initTranslate(lang);

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

    this.translate.get('newappointment.heading').subscribe((res: string) => {
      this.heading = res;
    });

    this.translate.get('newappointment.appointmentDate').subscribe((res: string) => {
      this.appointmentDate = res;
    });

    this.translate.get('newappointment.appointmentDatePH').subscribe((res: string) => {
      this.appointmentDatePH = res;
    });

    this.translate.get('newappointment.timeslot').subscribe((res: string) => {
      this.timeslot = res;
    });

    this.translate.get('newappointment.timeslotPH').subscribe((res: string) => {
      this.timeslotPH = res;
    });

    this.translate.get('newappointment.plateCode').subscribe((res: string) => {
      this.plateCode = res;
    });

    this.translate.get('newappointment.plateCodePH').subscribe((res: string) => {
      this.plateCodePH = res;
    });

    this.translate.get('newappointment.plateNo').subscribe((res: string) => {
      this.plateNo = res;
    });

    this.translate.get('newappointment.plateNoPH').subscribe((res: string) => {
      this.plateNoPH = res;
    });
    
    this.translate.get('newappointment.goText').subscribe((res: string) => {
      this.goText = res;
    });

    this.translate.get('newappointment.Dismiss').subscribe((res: string) => {
      this.Dismiss = res;
    });

    this.translate.get('newappointment.doneText').subscribe((res: string) => {
      this.doneText = res;
    });

    this.translate.get('newappointment.cancelText').subscribe((res: string) => {
      this.cancelText = res;
    });

    this.translate.get('newappointment.serviceAdvisor').subscribe((res: string) => {
      this.serviceAdvisor = res;
    });

    this.translate.get('newappointment.serviceAdvisorPH').subscribe((res: string) => {
      this.serviceAdvisorPH= res;
    });

    this.translate.get('newappointment.AppointmentType').subscribe((res: string) => {
      this.AppointmentType = res;
    });

    this.translate.get('newappointment.appontmentTypePH').subscribe((res: string) => {
      this.appontmentTypePH= res;
    });

    this.translate.get('confirmappointment.DGW').subscribe((res: string) => {
      this.DGW = res;
    });

    this.translate.get('confirmappointment.Ok').subscribe((res: string) => {
      this.Ok = res;
    });
  
  }


  save(){

  }


 /* async openConfirmAppointment() {
        
    const modal = await this.modalCtrl.create({
      component: ConfirmappointmentPage,
      cssClass: 'cal-modal',
      backdropDismiss: false
    });
   
    await modal.present();
   
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {

      }    

    });
  } */

    private presentAlertDialog(msg: string) {
      this.alertCtrl
        .create({
          header: this.DGW,
          message: msg,
          buttons: [{
            text: this.Ok,
            role: 'ok',
            handler: () => {
              this.router.navigate(['/home/appointments/newappointment']);
            }
          }]
        })
        .then(alertEl => alertEl.present());
    }


  onCreateAppointment(){

    if (this.form.invalid){

      if (this.lang != 'en'){
        this.presentAlertDialog("يرجى ملء جميع المعلومات!");
      } else{
        this.presentAlertDialog("Please fill all the information!");       
      }
      return;
    }


    const { appointmentDate,timeslot, platecode,plateno,serviceAdvisorId } = this.form.value;
 
   /* let alertMsg='Please select valid appointment date!';

    if (this.lang != 'en'){
      alertMsg = 'الرجاء تحديد تاريخ الموعد الصحيح'
    }

    if (this.timeslots.length==0){
      this.presentAlertDialog(alertMsg);
      return;
    }

    
    /*

    const appointmentDate  =  this.form.value.appointmentDate.toString("dd-MM-yyyy");
    const timeslot  =  this.form.value.timeslot;
    const platecode = this.form.value.platecode;
    const plateno= this.form.value.plateno;
    const serviceAdvisorId= this.form.value.serviceAdvisorId;
    //const appointmentTypeId=this.form.value.appointmentTypeId;

    */

   // const appointmentTypeId=null;

    //console.log(this.form);

    
   // const dateString = '2023-10-25T14:30:00Z';

   


  
    this.router.navigate(['/home/appointments/confirmappointment'
    ,{appointmentDate:this.dtSelectedToMove,timeslot:timeslot,platecode:platecode,plateno:plateno,servadv:serviceAdvisorId}]);

  }

  
  getPlateCodes(){
    
    this.subTimeslot = this.appointmentService.getPlateCodes(this.loadedUserToken).subscribe((pc) => {

      this.platecodes= pc;

     });

  }

  getTimeslots(e:any){

    this.bIsCalenderOpened=false;
   
    this.firstTimeLoad=false;

    if (e.detail.value){

      console.log('what is val');

      console.log(e.detail.value);

      let dtArray= e.detail.value.split('-');

    let dtSelected= dtArray[1].toString() + '-' +  dtArray[2].substring(0, 2).toString() +  '-' + dtArray[0].toString();
    
    this.dtSelectedDisplay  = dtArray[2].substring(0, 2).toString() + '-' +  dtArray[1].toString() +  '-' + dtArray[0].toString();

    console.log(` actual ${dtSelected} and after ${this.dtSelectedDisplay}`);

    this.dtSelectedToMove = dtArray[0].substring(0, 4).toString() + '-' + dtArray[1].toString() +  '-' + dtArray[2].toString();

    console.log(` so move ${this.dtSelectedToMove} `);

    this.subTimeslot = this.appointmentService.getTimeslots(this.loadedUserToken,dtSelected).subscribe((ts) => {

      if (ts.length>0){

        this.timeSlotAvailable=true;

        

      }else{

        this.timeSlotAvailable=false;
        
        if (this.lang != 'en'){
          this.timeslotNotAvailableMsg = 'لا توجد فترات زمنية متاحة للتاريخ المحدد'
        } else{
          this.timeslotNotAvailableMsg = 'There is no timeslots available for the selected date';          
        }

      }

      this.timeslots= ts;


     });

    }
    
    

  }


  openCalendar() {
    this.showCalendar = true;
    this.bIsCalenderOpened=true;
  }
  cancelCalendar() {
    this.showCalendar = false;
  }

  ngOnDestroy() {

    if (this.authUsr) {
      this.authUsr.unsubscribe();
    }
    
    if (this.subPlatecodes) {
      this.subPlatecodes.unsubscribe();
     }

    if (this.subTimeslot) {
      this.subTimeslot.unsubscribe();
     }

    if (this.subTodayTimeslot) {
      this.subTodayTimeslot.unsubscribe();
    }

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }


    

  }


}
