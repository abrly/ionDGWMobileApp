import { Component, OnInit , OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { RegistrationService } from '../registration/registration.service';
import { MobilePrefixData } from '../registration/models/mobileprefixdata.model';
import { Reginitiation } from '../registration/models/reginitiation.model';
import { Regverification } from '../registration/models/regverification.model';
import { AccountHelperService, AccountHelperResponseData } from './accounthelper.service';
import { VerifyuserOTPComponent } from './verifyuser-otp/verifyuser-otp.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-accounthelper',
  templateUrl: './accounthelper.page.html',
  styleUrls: ['./accounthelper.page.scss'],
})
export class AccounthelperPage implements OnInit , OnDestroy {

  lang: string;
  isLoading = false;
  isAccountHelperProcessFailed = false;
  accountHelperProcessFailReason: string;
  loadedMobilePrefixes: MobilePrefixData[];
  form: FormGroup;

  heading1: string;
  step1: string;
  step2: string;
  selectMobilePrefix: string;
  selectMobilePrefixPlaceholder: string;
  mobileNumber: string;
  mobileNumberPlaceholder: string;
  message: string;
  submit: string;

  retriveaccount: string;
  successmsg: string;
  invalidOTP: string;
  failedToEnterOTP: string;
  Ok: string;
  cancelText: string;

  private prefixSub: Subscription;
  private subAppLang: Subscription;
  private usrRegChkrSub: Subscription;


  constructor(
    private router: Router,
    private regService: RegistrationService,
    private accountHelperService: AccountHelperService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    private authService: AuthService,
    private modalCtrl: ModalController) { }



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
     });


  }


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

    this.translate.get('accounthelper.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });
   
    this.translate.get('accounthelper.step1').subscribe((res: string) => {
      this.step1 = res;
    });
    this.translate.get('accounthelper.step2').subscribe((res: string) => {
      this.step2 = res;
    });
    this.translate.get('accounthelper.selectMobilePrefix').subscribe((res: string) => {
      this.selectMobilePrefix = res;
    });

    this.translate.get('accounthelper.selectMobilePrefixPlaceholder').subscribe((res: string) => {
      this.selectMobilePrefixPlaceholder = res;
    });

    this.translate.get('accounthelper.mobileNumber').subscribe((res: string) => {
      this.mobileNumber = res;
    });

    this.translate.get('accounthelper.mobileNumberPlaceholder').subscribe((res: string) => {
      this.mobileNumberPlaceholder = res;
    });

    this.translate.get('accounthelper.message').subscribe((res: string) => {
      this.message = res;
    });
    this.translate.get('accounthelper.submit').subscribe((res: string) => {
      this.submit = res;
    });

    this.translate.get('accounthelper.retriveaccount').subscribe((res: string) => {
      this.retriveaccount = res;
    });

    this.translate.get('accounthelper.successmsg').subscribe((res: string) => {
      this.successmsg = res;
    });

    this.translate.get('accounthelper.invalidOTP').subscribe((res: string) => {
      this.invalidOTP = res;
    });

    this.translate.get('accounthelper.failedToEnterOTP').subscribe((res: string) => {
      this.failedToEnterOTP = res;
    });

    this.translate.get('accounthelper.Ok').subscribe((res: string) => {
      this.Ok = res;
    });

    this.translate.get('accounthelper.cancelText').subscribe((res: string) => {
      this.cancelText = res;
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

    this.isAccountHelperProcessFailed = false;

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
            res(null);
        } else {
          res({RegNotExists: true});
        }

      });

    });

    return promis;


  }

  onInitiateForgotPassword() {

    this.isAccountHelperProcessFailed = false;

    if (!this.form.valid) {
      return;
    }

    const pMobilePrefix  =  this.form.value.mobilePrefix;
    const pmobileNumber  =  this.form.value.mobileNumber;
    const regInitInfo = new Reginitiation(pMobilePrefix , pmobileNumber );

    this.initiateAccountHelpingProcess(regInitInfo);
    this.form.reset();


  }


  initiateAccountHelpingProcess(regUserDetails: Reginitiation) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: this.retriveaccount })
      .then(loadingEl => {
        loadingEl.present();
        let regObs: Observable<AccountHelperResponseData>;
        regObs = this.accountHelperService.inititateAccountHelper(regUserDetails.mobilePrefix, regUserDetails.mobileno);
        regObs.subscribe(
          resData => {
            this.isLoading = false;

            if (resData.ResponseCode !== '0') {

              loadingEl.dismiss();
              this.isAccountHelperProcessFailed = true;
              this.accountHelperProcessFailReason = resData.ResponseDescription;
              return;
            }

            const prefix = regUserDetails.mobilePrefix.substr(1, 2);
            const mobileNumber = '971' + prefix + regUserDetails.mobileno;

            const verificationNeededUser = new Regverification(mobileNumber, '');

            this.modalCtrl.create
            ({component : VerifyuserOTPComponent, componentProps: { regUser : verificationNeededUser , lang: this.lang }})
            .then((modalEl => {

                loadingEl.dismiss();
                modalEl.present();
                return modalEl.onDidDismiss();
            }))
            .then((result) => {
               if (result.role === 'confirm') {
                 if (result.data.isVerificationDone === true) {
                  this.isAccountHelperProcessFailed = false;
                  this.accountHelperProcessFailReason = '';

                  this.showAlert
                  (this.successmsg);

                 } else {

                  this.isAccountHelperProcessFailed = true;
                  this.accountHelperProcessFailReason = this.invalidOTP;

                 }

               } else {

                this.isAccountHelperProcessFailed = true;
                this.accountHelperProcessFailReason = this.failedToEnterOTP;

               }
            })} ,
          errRes => {
            loadingEl.dismiss();
            const message = errRes.error.ResponseDescription;
            this.isAccountHelperProcessFailed = true;
            this.accountHelperProcessFailReason = message;
            this.showAlert(message);
          }
        );
      });

  }

  private showAlert(msg: string) {
    this.alertCtrl
      .create({
        header: this.retriveaccount,
        message: msg,
        buttons: [{
          text: this.Ok,
          role: 'ok',
          handler: () => {
            this.router.navigate(['/', 'auth']);
          }
        }]
      })
      .then(alertEl => alertEl.present());
  }

  ngOnDestroy(){

    if (this.prefixSub){
      this.prefixSub.unsubscribe();
    }

    if (this.usrRegChkrSub){
      this.usrRegChkrSub.unsubscribe();
    }

    if (this.subAppLang){
      this.subAppLang.unsubscribe();
    }
   }

}
