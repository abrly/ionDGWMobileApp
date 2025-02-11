import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController  } from '@ionic/angular';
import { RegistrationService, RegResponseData } from './registration.service';
import { Observable } from 'rxjs';
import { VerifyregistrationComponent } from './verifyregistration/verifyregistration.component';
import { Reginitiation } from './models/reginitiation.model';
import { MobilePrefixData } from './models/mobileprefixdata.model';
import { Regverification } from './models/regverification.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit , OnDestroy {

  submitted = false;
  lang: string;
  isLoading = false;
  isRegistrationFailed = false;
  registrationFailReason: string;
  loadedMobilePrefixes: MobilePrefixData[];
  form: FormGroup;
  
  title: string;
  heading1: string;
  step1: string;
  step2: string;
  step3: string;
  selectMobilePrefix: string;
  selectMobilePrefixPlaceholder: string;
  mobileNumber: string;
  mobileNumberPlaceholder: string;
  message: string;
  regFailReason: string;
  switchToLogin: string;
  signup: string;

  invalidOTP: string;
  failedToEnterOTP: string;
  Ok: string;
  cancelText: string;
  IamaDGWCustomer:string;
  IAccept:string;
  TermsConditions:string;
  IamaDGWCustomerMsg:string;
  TermsConditionsMsg:string;


  private prefixSub: Subscription;
  private usrRegChkrSub: Subscription;
  private subAppLang: Subscription;
  private subReg: Subscription;

  constructor(
            private router: Router,
            private regService: RegistrationService,
            private loadingCtrl: LoadingController,
            private alertCtrl: AlertController,
            public translate: TranslateService,
            private authService: AuthService,
            private modalCtrl: ModalController) { }

  get f() { return this.form.controls; }

  ngOnInit() {


    this.prefixSub = this.regService.getMobilePrefixes().subscribe(pFixes => {
      this.loadedMobilePrefixes = pFixes;
    });

    this.form = new FormGroup({
      mobilePrefix: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(3)]
      }),
      mobileNumber: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(7)],
        asyncValidators: [this.IsRegistrationExists.bind(this)]
      }),
      isDGWCustomer: new FormControl(false, {
          validators: [Validators.requiredTrue]        
      }),
      acceptTerms: new FormControl(false, {
        validators: [Validators.requiredTrue]       
      }),
     });

  }

  //component.ts
/*public customertype:boolean;

public onCustomerTypeChanged(value:boolean){
    this.customertype = value;

    this.form.patchValue({
      isDGWCustomer: this.customertype,
      
    });
}
*/

  ionViewDidEnter(): void {
    this.getUserLanguage();
  }


  getUserLanguage() {

    this.subAppLang = this.authService.anonyUserLang.subscribe((lang) => {

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

    this.translate.get('signup.title').subscribe((res: string) => {
      this.title = res;
    });

    this.translate.get('signup.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });

    this.translate.get('signup.step1').subscribe((res: string) => {
      this.step1 = res;
    });

    this.translate.get('signup.step2').subscribe((res: string) => {
      this.step2 = res;
    });

    this.translate.get('signup.step3').subscribe((res: string) => {
      this.step3 = res;
    });

    this.translate.get('signup.selectMobilePrefix').subscribe((res: string) => {
      this.selectMobilePrefix = res;
    });

    this.translate.get('signup.selectMobilePrefixPlaceholder').subscribe((res: string) => {
      this.selectMobilePrefixPlaceholder = res;
    });

    this.translate.get('signup.mobileNumber').subscribe((res: string) => {
      this.mobileNumber = res;
    });

    this.translate.get('signup.mobileNumberPlaceholder').subscribe((res: string) => {
      this.mobileNumberPlaceholder = res;
    });

    this.translate.get('signup.message').subscribe((res: string) => {
      this.message = res;
    });

    this.translate.get('signup.regFailReason').subscribe((res: string) => {
      this.regFailReason = res;
    });

    this.translate.get('signup.switchToLogin').subscribe((res: string) => {
      this.switchToLogin = res;
    });

    this.translate.get('signup.signup').subscribe((res: string) => {
      this.signup = res;
    });


    this.translate.get('signup.invalidOTP').subscribe((res: string) => {
      this.invalidOTP = res;
    });

    this.translate.get('signup.failedToEnterOTP').subscribe((res: string) => {
      this.failedToEnterOTP = res;
    });

    this.translate.get('signup.Ok').subscribe((res: string) => {
      this.Ok = res;
    });

    this.translate.get('signup.cancelText').subscribe((res: string) => {
      this.cancelText = res;
    });

    this.translate.get('signup.IamaDGWCustomer').subscribe((res: string) => {
      this.IamaDGWCustomer = res;
    });

    this.translate.get('signup.IAccept').subscribe((res: string) => {
      this.IAccept = res;
    });

    this.translate.get('signup.TermsConditions').subscribe((res: string) => {
      this.TermsConditions = res;
    });

    this.translate.get('signup.IamaDGWCustomerMsg').subscribe((res: string) => {
      this.IamaDGWCustomerMsg = res;
    });

    this.translate.get('signup.TermsConditionsMsg').subscribe((res: string) => {
      this.TermsConditionsMsg = res;
    });

  }



  IsMobilePrefixSelected(control: FormControl): Promise<any> | Observable<any> {

    const promis = new Promise<any>((res, rej) => {

    if (this.form.get('mobilePrefix').value === null) {

      res({PrefixSelected: false});

    } else {

      res(null);
    }

     });

    return promis;

  }



  IsRegistrationExists(control: FormControl): Promise<any> | Observable<any> {

    this.isRegistrationFailed = false;

    let fullMobileNumber;

    let prefix;



    if (this.form.get('mobilePrefix').value === null) {
      return new Promise<any>((res, rej) => {
        res(null);
      });
    }

    prefix = this.form.get('mobilePrefix').value.toString().substr(1);

    fullMobileNumber = '971' + prefix + control.value.toString();

    const promis = new Promise<any>((res, rej) => {

    this.usrRegChkrSub = this.regService.isUserRegExists(fullMobileNumber).subscribe((resp) => {

    if (resp.ResponseCode === '0') {
          res({regExists: true});
        } else {
          res(null);
        }

      });

    });

    return promis;


  }

  onInitiateSignUp()
  {

    this.isRegistrationFailed = false;

    if (!this.form.valid) {
      return;
    }


    const pMobilePrefix  =  this.form.value.mobilePrefix;
    const pmobileNumber  =  this.form.value.mobileNumber;
    const regInitInfo = new Reginitiation(pMobilePrefix , pmobileNumber );

    this.initiateregistration(regInitInfo);
    this.form.reset();

  }


  initiateregistration(regUserDetails: Reginitiation) {
    this.submitted = true;
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: this.signup })
      .then(loadingEl => {
        loadingEl.present();
        let regObs: Observable<RegResponseData>;
        regObs = this.regService.inititateSignup(regUserDetails.mobilePrefix, regUserDetails.mobileno);
        this.subReg = regObs.subscribe(
          resData => {
            this.isLoading = false;
            if (resData.ResponseCode !== '0') {
              loadingEl.dismiss();
              this.isRegistrationFailed = true;
              this.registrationFailReason = resData.ResponseDescription;
              return;
            }
            const verificationNeededUser = new Regverification(resData.UserMobileNo, '');
            this.modalCtrl
            .create({component : VerifyregistrationComponent, componentProps: { regUser : verificationNeededUser , lang: this.lang}})
            .then((modalEl => {
                loadingEl.dismiss();
                modalEl.present();
                return modalEl.onDidDismiss();
            }))
            .then((result) => {
               if (result.role === 'confirm') {
                 if (result.data.isVerificationDone === true) {
                    this.isRegistrationFailed = false;
                    this.registrationFailReason = '';
                    this.router.navigate(['/', 'reg', 'confirmregistration', result.data.confirmationTrxID]);


                 } else {

                    this.isRegistrationFailed = true;
                    this.registrationFailReason = this.invalidOTP;

                 }

               } else {

                this.isRegistrationFailed = true;
                this.registrationFailReason = this.failedToEnterOTP;

               }
            })} ,
          errRes => {
            loadingEl.dismiss();
            const message = errRes.error.ResponseDescription;
            this.isRegistrationFailed = true;
            this.registrationFailReason = message;
            this.showAlert(message);
          }
        );
      });


  }


  private showAlert(msg: string) {
    this.alertCtrl
      .create({
        header: this.signup,
        message: msg,
        buttons: [this.Ok]
      })
      .then(alertEl => alertEl.present());
  }

 onSwitchToLogin(){

  this.router.navigate(['/auth']);

 }


 ngOnDestroy(){

  if (this.prefixSub) {
    this.prefixSub.unsubscribe();
  }

  if (this.subReg) {
    this.subReg.unsubscribe();
  }

  if (this.usrRegChkrSub) {
    this.usrRegChkrSub.unsubscribe();
  }

  if (this.subAppLang) {
    this.subAppLang.unsubscribe();
  }


 }

}
