import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { VehicleinfoService } from './vehicleinfo.service';
import { Platecode } from '../appointments/models/platecode.model'; 
import { AppointmentService } from '../appointments/appointment.service';
import { Subscription } from 'rxjs';
import { filter, switchMap  } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController } from '@ionic/angular';
import { VehicleInformation } from './vehicleInformation.model';

@Component({
  selector: 'app-vehicleinfo',
  templateUrl: './vehicleinfo.page.html',
  styleUrls: ['./vehicleinfo.page.scss'],
})
export class VehicleinfoPage implements OnInit {

  form: FormGroup;
  lang: any;
  loadedUserToken: string;
  isLoading: boolean;

  PleaseWait:string;

  platecodes:Platecode[];
  vehicleInformation: VehicleInformation;  
  resultFound: string;


  heading:string;
  subheading:string;
  plateCodePH:string;
  Dismiss:string;
  platenoPH:string;
  Search:string;
  noresultsfound:string;
  Year:string;
  Color:string;
  LicenseDate:string;
  LicenseExpiry:string;
  ChassisNo:string;
  EngineNo:string;
  LastMeterReading:string;
  InsuranceRefNo:string;
  OwnerName:string;
  OperatorName:string;
  ServiceCost:string;
  Ok:string;
  WorkOrderDocUrlCap:string;
  Attachments:string;

  private authUsr: Subscription;
  private subPlatecodes: Subscription;
  private subAppLang: Subscription;
  private vehicleInfoSub: Subscription;

  constructor(private authService: AuthService,private vehicleInfoService:VehicleinfoService,
              public loadingController: LoadingController,private appointmentService:AppointmentService,public translate:TranslateService) { }

  ngOnInit() {

    this.resultFound="false";

    this.authUsr = this.authService.token
    .pipe(
     filter(response => !!response),
     switchMap(response => {
     this.loadedUserToken = response;
     return this.appointmentService.getPlateCodes(this.loadedUserToken);
     })
     ).subscribe((response) => {
       this.platecodes = response;
     });


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

    this.translate.get('vehicleInformation.heading').subscribe((res: string) => {
      this.heading = res;
    });

    this.translate.get('vehicleInformation.subheading').subscribe((res: string) => {
      this.subheading = res;
    });

    this.translate.get('vehicleInformation.plateCodePH').subscribe((res: string) => {
      this.plateCodePH = res;
    });

    this.translate.get('vehicleInformation.Dismiss').subscribe((res: string) => {
      this.Dismiss = res;
    });

    this.translate.get('vehicleInformation.platenoPH').subscribe((res: string) => {
      this.platenoPH = res;
    });

    this.translate.get('vehicleInformation.Search').subscribe((res: string) => {
      this.Search = res;
    });

    this.translate.get('vehicleInformation.noresultsfound').subscribe((res: string) => {
      this.noresultsfound = res;
    });

    this.translate.get('vehicleInformation.Year').subscribe((res: string) => {
      this.Year = res;
    });

    this.translate.get('vehicleInformation.Color').subscribe((res: string) => {
      this.Color = res;
    });

    this.translate.get('vehicleInformation.LicenseDate').subscribe((res: string) => {
      this.LicenseDate = res;
    });

    this.translate.get('vehicleInformation.LicenseExpiry').subscribe((res: string) => {
      this.LicenseExpiry = res;
    });

    this.translate.get('vehicleInformation.ChassisNo').subscribe((res: string) => {
      this.ChassisNo = res;
    });

    this.translate.get('vehicleInformation.EngineNo').subscribe((res: string) => {
      this.EngineNo = res;
    });

    this.translate.get('vehicleInformation.LastMeterReading').subscribe((res: string) => {
      this.LastMeterReading = res;
    });

    this.translate.get('vehicleInformation.InsuranceRefNo').subscribe((res: string) => {
      this.InsuranceRefNo = res;
    });

    this.translate.get('vehicleInformation.OwnerName').subscribe((res: string) => {
      this.OwnerName = res;
    });

    this.translate.get('vehicleInformation.OperatorName').subscribe((res: string) => {
      this.OperatorName = res;
    });

    this.translate.get('vehicleInformation.ServiceCost').subscribe((res: string) => {
      this.ServiceCost = res;
    }); 

    this.translate.get('vehicleInformation.PleaseWait').subscribe((res: string) => {
      this.PleaseWait = res;
    }); 

    this.translate.get('vehicleInformation.Ok').subscribe((res: string) => {
      this.Ok = res;
    }); 

    this.translate.get('vehicleInformation.WorkOrderDocUrlCap').subscribe((res: string) => {
      this.WorkOrderDocUrlCap = res;
    }); 

    this.translate.get('vehicleInformation.Attachments').subscribe((res: string) => {
      this.Attachments= res;
    }); 


  }


  onSearchVehicle(){

    if (!this.form.valid) {
      return;
    }
   
    const fullPlateNo = this.form.value.platecode + '-' + this.form.value.plateno;   

    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: this.PleaseWait })
      .then(loadingEl => {
        loadingEl.present();

        this.vehicleInfoSub = this.vehicleInfoService.GetVehicleInfoByPlateNo(this.loadedUserToken,fullPlateNo).subscribe(vInfo => {

          this.vehicleInformation = vInfo;

          if (this.vehicleInformation.Name!=null) {
            this.resultFound = "true";
          } else {
            this.resultFound = "false";
          }

          this.isLoading = false;
          loadingEl.dismiss();

        });
      });

  


  }


  openMe(webpage){
    window.open(webpage,'_system','location=no');   
  }



  ngOnDestroy() {

    if (this.authUsr) {
      this.authUsr.unsubscribe();
    }
    
    if (this.subPlatecodes) {
      this.subPlatecodes.unsubscribe();
     }
  
    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }

    if (this.vehicleInfoSub) {
      this.vehicleInfoSub.unsubscribe();
    }
  }


}
