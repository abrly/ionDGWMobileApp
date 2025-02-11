import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalendarComponent } from 'ionic2-calendar';
import { filter, switchMap  } from 'rxjs/operators';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { AppointmentService } from './appointment.service';
import { TranslateService } from '@ngx-translate/core';
import { Appointment } from './models/appointment.model';
import { Router } from '@angular/router';
import { ViewappointmentComponent } from './viewappointment/viewappointment.component'

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/ar-AE';
registerLocaleData(localeEs);

import { CalendarMode } from 'ionic2-calendar';



@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements  OnDestroy {


  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  lang: string;
  isLoading: boolean;
  loadedUserToken: string;
  loadedUserDept:string;
  viewMonth:string;
  viewYear:string;
  PleaseWait: string;
  recordsFound: boolean;

  appointments: Appointment[];
  appointmentsSnapshot: Appointment[];

  heading:string;
  cpMonth:string;
  cpWeek:string;
  cpDay:string;

  Confirmcancellation:string;
  CancelMessage:string;
  No:string;
  Yes:string;
  

  private authUsr: Subscription;
  private apmtSelectSub: Subscription;
  private apmtSub: Subscription;
  private cancelApmtSub: Subscription;
  private subAppLang: Subscription;

  eventSource;
  viewTitle;

  isToday:boolean;
  //calLocale:string="en-GB";

  

  calendar = {
    
    locale:"en-GB",
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
    startHour : 7,
    endHour : 16,
    step:30,
    dateFormatter: {
        formatMonthViewDay: function(date:Date) {
            return date.getDate().toString();
        },
        formatMonthViewDayHeader: function(date:Date) {
            return 'MonMH';
        },
        formatMonthViewTitle: function(date:Date) {
            return 'testMT';
        },
        formatWeekViewDayHeader: function(date:Date) {
            return 'MonWH';
        },
        formatWeekViewTitle: function(date:Date) {
            return 'testWT';
        },
        formatWeekViewHourColumn: function(date:Date) {
            return 'testWH';
        },
        formatDayViewHourColumn: function(date:Date) {
            return 'testDH';
        },
        formatDayViewTitle: function(date:Date) {
            return 'testDT';
        }
    }
};
  

  constructor(private authService: AuthService , private appointmentService: AppointmentService,private router: Router,
    public loadingController: LoadingController , public translate: TranslateService,private alertCtrl:AlertController,private modalCtrl: ModalController) {

  }







  ionViewWillEnter(){

    //console.log("ionViewWillEnter");

    this.calendar.mode = "month";

    this.isLoading = false;
    
    this.authUsr = this.authService.token
    .pipe(
     filter(response => !!response),
     switchMap(response => {
     this.loadedUserToken = response;
     return this.authService.userDeptNo;
     })
     ).subscribe((response) => {
      this.loadedUserDept = response;
 
      this.loadCurrentMonthAppointments();

     });
    
    
   
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

  this.translate.get('appointment.heading').subscribe((res: string) => {
    this.heading = res;
  });

  this.translate.get('appointment.cpMonth').subscribe((res: string) => {
    this.cpMonth = res;
  });

  this.translate.get('appointment.cpWeek').subscribe((res: string) => {
    this.cpWeek = res;
  });

  this.translate.get('appointment.cpDay').subscribe((res: string) => {
    this.cpDay = res;
  });

  this.translate.get('appointment.Confirmcancellation').subscribe((res: string) => {
    this.Confirmcancellation = res;
  });

  this.translate.get('appointment.CancelMessage').subscribe((res: string) => {
    this.CancelMessage = res;
  });

  this.translate.get('appointment.No').subscribe((res: string) => {
    this.No = res;
  });

  this.translate.get('appointment.Yes').subscribe((res: string) => {
    this.Yes = res;
  });


  //console.log('1r');
    if (this.lang=="en"){
     // this.calLocale="en-GB";
    //  console.log('2r');
      this.myCal.locale = "en-GB";
    } else if  (this.lang=="ar"){
     
      this.myCal.locale = "ar-AE";
      //console.log('what down');
     // console.log(this.myCal.locale);
     // console.log('3r');
    }

   
}

 
 
  onNewAppointment(){

    this.router.navigate(['/home/appointments/newappointment']);

  }

  

  loadCurrentMonthAppointments() {

    this.eventSource=[];
 
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: this.PleaseWait })
      .then(loadingEl => {
        loadingEl.present();

        var dateObj = new Date();

        var viewMonth = (dateObj.getUTCMonth() + 1).toString(); 
        var viewYear = (dateObj.getUTCFullYear()).toString();  

        this.apmtSelectSub = this.appointmentService.GetAppointments(this.loadedUserToken,viewMonth, viewYear).subscribe(apmt => {

          this.appointments = apmt;

          var events = [];

          var startTime;
          var endTime;
       
          this.appointments.forEach(el => {  

            var frmDate = new Date(el.StartDateTime);            
            var toDate= new Date(el.EndDateTime);
            
            startTime = new Date(frmDate.getFullYear(), frmDate.getMonth(), frmDate.getDate() ,frmDate.getHours(), frmDate.getMinutes());
            endTime = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() , toDate.getHours(), toDate.getMinutes());
            
            var evntDesc = el.AppointmentID + ' | ' + el.PlateCode + ' - ' + el.PlateNo + ' | ' + el.Description;

            events.push({
              title:  evntDesc.substr(0,35) + "...",
              startTime: startTime,
              endTime: endTime,
              allDay: false
            });
          });

          this.eventSource=events;

          if (apmt.length > 0) {
            this.recordsFound = true;
          } else {
            this.recordsFound = false;
          }
          this.isLoading = false;
          loadingEl.dismiss();
        });
      });

  }

  loadAppointments(viewMonth,viewYear) {
    
    this.eventSource=[];
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: this.PleaseWait })
      .then(loadingEl => {
        loadingEl.present();

        this.apmtSub = this.appointmentService.GetAppointments(this.loadedUserToken,viewMonth, viewYear).subscribe(apmt => {

          this.appointments = apmt;

          var events = [];

          var startTime;
          var endTime;
       
          this.appointments.forEach(el => {  

            var frmDate = new Date(el.StartDateTime);            
            var toDate= new Date(el.EndDateTime);
            
            startTime = new Date(frmDate.getFullYear(), frmDate.getMonth(), frmDate.getDate() ,frmDate.getHours(), frmDate.getMinutes());
            endTime = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() , toDate.getHours(), toDate.getMinutes());

            var evntDesc = el.AppointmentID + ' | ' + el.PlateCode + ' - ' + el.PlateNo + ' | ' + el.Description;

            events.push({
              title:  evntDesc.substr(0,35) + "...",
              startTime: startTime,
              endTime: endTime,
              allDay: false
            });
          });

          this.eventSource=events;

          if (apmt.length > 0) {
            this.recordsFound = true;
          } else {
            this.recordsFound = false;
          }
          this.isLoading = false;
          loadingEl.dismiss();
        });
      });

  }


  next() {

    this.myCal.slideNext();
   
    var viewMonth = this.myCal.currentDate.getMonth()+2;
    var viewYear = this.myCal.currentDate.getFullYear();

    this.loadAppointments(viewMonth,viewYear);

  }
 
  back() {

    this.myCal.slidePrev();
    
    var viewMonth = this.myCal.currentDate.getMonth();
    var viewYear = this.myCal.currentDate.getFullYear();

    this.loadAppointments(viewMonth,viewYear);

  }

  onViewTitleChanged(title) {
      this.viewTitle = title;
  }

  async onEventSelected(event) {

        var title=event.title.substr(0,35);

      //  console.log('Event selected:' + title);

        var apmtID = title.split("|")[0].trim();        
            
        // Use Angular date pipe for conversion

        //let start = formatDate(event.startTime, 'medium', this.locale);
        //let end = formatDate(event.endTime, 'medium', this.locale);

        this.modalCtrl.create
            ({component : ViewappointmentComponent, componentProps: { loadedUserToken:this.loadedUserToken,apmtID : apmtID , lang: this.lang }})
            .then((modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            }))
            .then((result) => {
               if (result.role === 'delete') {

                 // console.log('delete called');
                
                  // get confirmation for deletion

                  this.onGetDeletionConfirmation(apmtID);
                  


               } else {

                // do nothing.
               
               }
            });
     
      
      

  }


  async onGetDeletionConfirmation(apmtID:string){

    const alert = await this.alertCtrl.create({
      header: this.Confirmcancellation,
      message: this.CancelMessage,
      buttons: [
        {
          text: this.No,
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: this.Yes,
          handler: () => {
            

            this.cancelApmtSub = this.appointmentService
                                 .CancelAppointment(this.loadedUserToken,apmtID).subscribe((resp)=>{
                                    
                                  this.router.navigate(['/home']);

                                 });
                                 
            }
        }
      ]
    });

    alert.present();

  /*  const alert = await this.alertCtrl.create({
      header: title,
      subHeader: '',
      message: "Are you sure want to cancel?",
      buttons: ['Yes','No'],
    });
    alert.present();  */

  }

  changeMode(mode) {
      this.calendar.mode = mode;
  }

  today() {
      this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev) {

/*
      console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
          (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);


    console.log('what is initially');

    console.log(ev.selectedTime);

    var frmSelected = new Date(ev.selectedTime);   
          
    this.viewMonth = ((frmSelected.getMonth()+1).toString()); 
    this.viewYear = (frmSelected.getFullYear().toString());

    console.log('so finally');
    console.log(this.viewMonth);
    console.log(this.viewYear); */
    

  //  this.loadAppointments(this.viewMonth,this.viewYear);
  }

  onCurrentDateChanged(event:Date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
  }

 /* createRandomEvents() {
      var events = [];
      for (var i = 0; i < 50; i += 1) {
          var date = new Date();
          var eventType = Math.floor(Math.random() * 2);
          var startDay = Math.floor(Math.random() * 90) - 45;
          var endDay = Math.floor(Math.random() * 2) + startDay;
          var startTime;
          var endTime;
          if (eventType === 0) {
              startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
              if (endDay === startDay) {
                  endDay += 1;
              }
              endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
              events.push({
                  title: 'All Day - ' + i,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: true
              });
          } else {
              var startMinute = Math.floor(Math.random() * 24 * 60);
              var endMinute = Math.floor(Math.random() * 180) + startMinute;
              startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
              endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
              
              events.push({
                  title: 'Event - ' + i,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: false
              });
          }
      }
      console.log('my events');
      console.log(events);
      console.log(' end my events');
      return events;
      
  } */

  onRangeChanged(ev) {
     // console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  markDisabled = (date:Date) => {
      var current = new Date();
      current.setHours(0, 0, 0);
      return date < current;
  };

  ngOnDestroy() {

    if (this.authUsr) {
      this.authUsr.unsubscribe();
    }

    if (this.apmtSub) {
      this.apmtSub.unsubscribe();
    }

    if (this.apmtSelectSub) {
      this.apmtSelectSub.unsubscribe();
    }

    if (this.cancelApmtSub) {
      this.cancelApmtSub.unsubscribe();
    }

    if (this.subAppLang){
      this.subAppLang.unsubscribe();
    }
    

  }
  
}
