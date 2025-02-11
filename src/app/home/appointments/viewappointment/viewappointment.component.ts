import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AppointmentService } from '../appointment.service';
import { Appointment } from '../models/appointment.model';
import { filter , switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
 
@Component({
  selector: 'app-viewappointment',
  templateUrl: './viewappointment.component.html',
  styleUrls: ['./viewappointment.component.scss'],
})
export class ViewappointmentComponent implements OnInit {

  @Input() loadedUserToken: string;
  @Input() apmtID: string;
  @Input() lang: string;

  private apmtSub: Subscription;
  private subAppLang: Subscription;

  appointments: Appointment[];
  appointment: Appointment;
  loadedUserDeptNo:string;
  equipmentID:string;
  equipmentDesc:string;
  vehicleReg:string;

  heading:string;
  cpVehicleReg:string;
  cpEquipmentID:string;
  cpEquipmentDesc:string;
  cpAppointmentDate:string;
  cpTimeslot:string;
  cpMessageDescription:string;
  cpCancelAppointment: string;


  cpServiceAdvisor:string;
  ServiceAdvisor:string;

  cpMeterReading:string;
  MeterReading:string;

  cpAppointmentType:string;

  constructor(private modalctrl: ModalController,
    public translate: TranslateService,private appointmentService:AppointmentService,
    private authService:AuthService
    ) { }


  ngOnInit() {

    this.fetchAppointmentDetails(this.apmtID);

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

    this.translate.get('viewappointment.heading').subscribe((res: string) => {
      this.heading = res;
    });

    this.translate.get('viewappointment.cpVehicleReg').subscribe((res: string) => {
      this.cpVehicleReg = res;
    });

    this.translate.get('viewappointment.cpEquipmentID').subscribe((res: string) => {
      this.cpEquipmentID = res;
    });
   
    this.translate.get('viewappointment.cpEquipmentDesc').subscribe((res: string) => {
      this.cpEquipmentDesc = res;
    });
   
    this.translate.get('viewappointment.cpAppointmentDate').subscribe((res: string) => {
      this.cpAppointmentDate = res;
    });

    this.translate.get('viewappointment.cpTimeslot').subscribe((res: string) => {
      this.cpTimeslot = res;
    });

    this.translate.get('viewappointment.cpMessageDescription').subscribe((res: string) => {
      this.cpMessageDescription = res;
    });
    
    this.translate.get('viewappointment.cpCancelAppointment').subscribe((res: string) => {
      this.cpCancelAppointment = res;
    });


    this.translate.get('viewappointment.cpServiceAdvisor').subscribe((res: string) => {
      this.cpServiceAdvisor = res;
    });


    this.translate.get('viewappointment.cpMeterReading').subscribe((res: string) => {
      this.cpMeterReading = res;
    });

    this.translate.get('viewappointment.cpAppointmentType').subscribe((res: string) => {
      this.cpAppointmentType = res;
    });
    

  }



  fetchAppointmentDetails(apmtID){


    this.apmtSub = this.appointmentService.GetAppointment(this.loadedUserToken,apmtID)
    .pipe(
     filter(response => !!response),
     switchMap(response => {

       // console.log('what is resp');
       // console.log(response);

        this.appointment = response[0];

        this.vehicleReg= this.appointment.PlateCode + ' - ' + this.appointment.PlateNo

        this.MeterReading = this.appointment.MeterReading;

        this.ServiceAdvisor=this.appointment.ServiceAdvisorId;


        return this.authService.userDeptNo
     }),
     filter(response => !!response),
     switchMap(response => {     
       
      this.loadedUserDeptNo= response;

       return this.appointmentService.getVehicleDetails(this.loadedUserToken,this.loadedUserDeptNo,this.appointment.PlateNo,this.appointment.PlateCode);
     })
     ).subscribe((response) => {

      
       this.equipmentID = response.EquipmentID;
       this.equipmentDesc =  response.VehicleModel + ' - ' + response.VehicleYear + ' | ' +  response.VehicleType

        
     });


/*
    this.apmtSub = this.appointmentService.GetAppointment(this.loadedUserToken,apmtID).subscribe(pFixes => {
      this.appointment = pFixes[0];      
     }); */



  }

  

onDeleteAppointment(){
  this.modalctrl.dismiss({apmtID:this.appointment.AppointmentID}, 'delete');
}

onCancel() {
  this.modalctrl.dismiss(null, 'cancel');
}


  ngOnDestroy() {
    if (this.apmtSub) {
      this.apmtSub.unsubscribe();
    } 

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    } 
    
  }

}
