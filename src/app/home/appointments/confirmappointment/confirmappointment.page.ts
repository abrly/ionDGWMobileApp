import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable,Subscription } from 'rxjs';
import { filter , switchMap } from 'rxjs/operators';
import { AppointmentResponse, AppointmentService } from '../appointment.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Appointment } from '../models/appointment.model';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-confirmappointment',
  templateUrl: './confirmappointment.page.html',
  styleUrls: ['./confirmappointment.page.scss'],
})
export class ConfirmappointmentPage implements OnInit, OnDestroy {

  lang: any;
  form: FormGroup;

  pAppointmentDate:string;
  pTimeSlot:string;
  pPlatecode :string;
  pPlateno: string;
  pSrvAdvisorId:string;
  meterReading:string;
  loadedUserToken: string;
  loadedUserDeptNo:string;
  //vehicleDetail:VehicleDetail;

  pAppointmentTypeId:string;

  equipmentID:string;
  equipmentDesc:string;
  customerName:string;
  customerMobileNo:string;
  customerEmailAddress:string;
  customerAddress:string;
  vehicleDetail:string;
  vehicleColor:string;
  appointmentSubmissionDone=false;
  showAppointmentSubmissionCard=false;

  heading:string;
  cpVehicleReg:string;
  cpVehicleDetails:string;
  cpEquipmentID:string;
  cpAppointmentDate:string;
  cpTimeslot:string;
  cpMessageDescription:string;
  cpMessageDescriptionPH:string;
  cpBookAppointment:string;
  SubmissionSuccessResult:string;
  SubmissionFailedResult:string;
  AccessDenied:string;
  Plswait:string;
  DGW:string;
  Ok:string;

  cpMeterReading:string;
  

  private authUsr: Subscription;
 // private amptSub: Subscription;
  private subAppointment: Subscription;
  private subAppLang: Subscription;

  constructor(private authService: AuthService,private alertCtrl: AlertController,
              private activatedRoute: ActivatedRoute,private appointmentService:AppointmentService,
              private loadingCtrl: LoadingController,private router:Router,public translate: TranslateService) { }

  ngOnInit() {

    this.authUsr = this.authService.userName
    .pipe(
     filter(response => !!response),
     switchMap(response => {
     // console.log('step 1 - user');
     // console.log(response);
      this.customerName = response;
      return this.authService.token;
     }),    
    
     filter(response => !!response),
     switchMap(response => {
     
        this.loadedUserToken = response;   
         return this.authService.userDeptNo
     }),
     
     filter(response => !!response),
     switchMap(response => {
     
        this.loadedUserDeptNo= response;
        return this.activatedRoute.params;
      
     }),
     filter(response => !!response),
     switchMap(response => {   
      
      console.log('what is my param apt ment date 1 ???');

      console.log(response.appointmentDate);
      
       this.pAppointmentDate =response.appointmentDate;
       this.pTimeSlot = response.timeslot;
       this.pPlatecode = response.platecode;
       this.pPlateno = response.plateno;
       this.pSrvAdvisorId = response.servadv;
      // this.pAppointmentTypeId= response.aptype

       console.log('what is my param apt ment date???');
       console.log(this.pAppointmentDate);

      console.log(`what is full date ${new Date(this.pAppointmentDate)}`); 

      // console.log(this.loadedUserDeptNo);
      // console.log(this.pPlateno);
     //  console.log(this.pPlatecode);
       
       return this.appointmentService.getVehicleDetails(this.loadedUserToken,this.loadedUserDeptNo,this.pPlateno,this.pPlatecode);
     })
     ).subscribe((response) => {

       if (response.EquipmentID == null){

     
        this.showAppointmentSubmissionCard=false;


        if (this.lang != 'en'){
          this.AccessDenied = 'عذرا ، ليس لديك حق الوصول إلى هذه المركبة'
          this.Ok='تمام';
        } else{
          this.AccessDenied = 'Sorry, you do not have access to this vehicle!';
          this.Ok='Ok';
        }
    
        this.presentAlert(this.AccessDenied);
        
       }
       else{

        this.showAppointmentSubmissionCard=true;
        this.equipmentID = response.EquipmentID;
        this.equipmentDesc =  response.VehicleModel + ' - ' + response.VehicleYear + ' | ' +  response.VehicleType;         
       // this.meterReading= response.MeterReading;

      

       }
       
        

     });

    this.form = new FormGroup({
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1),Validators.max(50)]
      }),
      MeterReading: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      })
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

    this.translate.get('confirmappointment.heading').subscribe((res: string) => {
      this.heading = res;
    });

    this.translate.get('confirmappointment.cpVehicleReg').subscribe((res: string) => {
      this.cpVehicleReg = res;
    });

    this.translate.get('confirmappointment.cpVehicleDetails').subscribe((res: string) => {
      this.cpVehicleDetails = res;
    });

    this.translate.get('confirmappointment.cpEquipmentID').subscribe((res: string) => {
      this.cpEquipmentID = res;
    });

    this.translate.get('confirmappointment.cpAppointmentDate').subscribe((res: string) => {
      this.cpAppointmentDate = res;
    });
    
    this.translate.get('confirmappointment.cpTimeslot').subscribe((res: string) => {
      this.cpTimeslot = res;
    });

    this.translate.get('confirmappointment.cpMessageDescription').subscribe((res: string) => {
      this.cpMessageDescription = res;
    });

    this.translate.get('confirmappointment.cpMessageDescriptionPH').subscribe((res: string) => {
      this.cpMessageDescriptionPH = res;
    });

    this.translate.get('confirmappointment.cpBookAppointment').subscribe((res: string) => {
      this.cpBookAppointment = res;
    });

    this.translate.get('confirmappointment.SubmissionSuccessResult').subscribe((res: string) => {
      this.SubmissionSuccessResult = res;
    });

    this.translate.get('confirmappointment.SubmissionFailedResult').subscribe((res: string) => {
      this.SubmissionFailedResult = res;
    });
   
    this.translate.get('confirmappointment.AccessDenied').subscribe((res: string) => {
      this.AccessDenied = res;
    });

    this.translate.get('confirmappointment.Plswait').subscribe((res: string) => {
      this.Plswait = res;
    });

    this.translate.get('confirmappointment.DGW').subscribe((res: string) => {
      this.DGW = res;
    });

    this.translate.get('confirmappointment.Ok').subscribe((res: string) => {
      this.Ok = res;
    });

    this.translate.get('confirmappointment.cpMeterReading').subscribe((res: string) => {
      this.cpMeterReading = res;
    });

  }

  onBookAppointment(){


    if (!this.form.valid) {
      return;
    }

    const title = this.form.value.title;
    const description= this.form.value.description;
    const meterReading = this.form.value.MeterReading;
    
           
    this.loadingCtrl
    .create({
      message : this.Plswait
    })
    .then((loadEl) => {

      loadEl.present();
      let fbObs: Observable<AppointmentResponse>;

     /* console.log('what is appointment date');
      console.log(this.pAppointmentDate);
      console.log('so');
      console.log(new Date(this.pAppointmentDate)); */

      console.log(`what i am saving as appoitnemnt date 1 ${this.pAppointmentDate}`);

      console.log(`what i am saving as appoitnemnt date 2 ${new Date(this.pAppointmentDate)}`);
      

      fbObs = this.appointmentService.addAppointment(this.loadedUserToken,new Appointment(null,new Date(this.pAppointmentDate),this.pTimeSlot,null,null,title,
      description,this.customerName,this.customerMobileNo,this.customerEmailAddress,this.customerAddress,
      this.equipmentID,this.pPlateno,this.pPlatecode,this.lang,this.equipmentDesc,this.vehicleColor,null,null,null,this.pSrvAdvisorId,meterReading,this.pAppointmentTypeId,null));

      this.subAppointment = fbObs.subscribe((resp) => {

          if (resp.ResponseCode === '0'){

            loadEl.dismiss();
            this.form.reset();

            this.appointmentSubmissionDone = true;

            this.presentConfirmSubmission(this.SubmissionSuccessResult);


          } else {

            this.appointmentSubmissionDone = false;
            this.presentConfirmSubmission(this.SubmissionFailedResult);
            loadEl.dismiss();

          }

      });


    }).catch((err) => {

      this.appointmentSubmissionDone = false;

    });


  }

  private presentConfirmSubmission(msg: string) {
    this.alertCtrl
      .create({
        header: this.DGW,
        message: msg,
        buttons: [{
          text: this.Ok,
          role: 'ok',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }]
      })
      .then(alertEl => alertEl.present());
  }


  private presentAlert(msg: string) {

  
    this.alertCtrl
      .create({
        header: this.DGW,
        message: msg,
        buttons: [{
          text: this.Ok,
          role: 'ok',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }]
      })
      .then(alertEl => alertEl.present());
  }

  ngOnDestroy() {
    
    if (this.authUsr) {
      this.authUsr.unsubscribe();
    }

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }

    if (this.subAppointment) {
      this.subAppointment.unsubscribe();
    }
    

  }


}
