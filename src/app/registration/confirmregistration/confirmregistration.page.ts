import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { RegistrationService, RegProcessResponseData, VerifiedUserResponseData } from '../registration.service';
import { LanguageData } from '../../app/common/models/languagedata.model';
import { Registration } from '../models/registration.model';
import { CommonService } from 'src/app/app/common/common.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  selector: 'app-confirmregistration',
  templateUrl: './confirmregistration.page.html',
  styleUrls: ['./confirmregistration.page.scss'],
})
export class ConfirmregistrationPage implements OnInit, OnDestroy {

  lang: string;
  isSubmitted = false;
  isLoading = false;
  isRegistrationFailed = false; 
  confirmationTrxID: number;

  loadedLangs: LanguageData[];
  loadedUserInfo: VerifiedUserResponseData;
  loadedMobileNo: string;
  form: FormGroup;
  userIDValid: boolean;
  

  heading1: string;
  step1: string;
  step2: string;
  step3: string;
  firstName: string;
  firstNamePlaceholder: string;
  firstNameRequired: string;
  lastName: string;
  lastNamePlaceholder: string;
  lastNameRequired: string;
  userID: string;
  userIDPlaceholder: string;
  userIDRequired: string;
  userIDTaken: string;
  password: string;
  passwordPlaceholder: string;
  passwordRequired: string;
  confirmpassword: string;
  confirmpasswordPlaceholder: string;
  confirmpasswordMessage: string;
  email: string;
  emailPlaceholder: string;
  emailMessage: string;
  preferredLanguage: string;
  message: string;
  complete: string;

  completeSuccess: string;
  signup: string;
  Ok: string;
  cancelText: string;
  useridMinLenMsg:string;
  useridMaxLenMsg:string;

  private confirmSub: Subscription;
  private completeSub: Subscription;
  private usrAvailChkrSub: Subscription;
  private subAppLang: Subscription;


  constructor(
    private activatedRoute: ActivatedRoute,
    private regService: RegistrationService,
    private commonService: CommonService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    private authService: AuthService,
    private router: Router) {}


 
  ngOnInit() {

    this.confirmationTrxID = +this.activatedRoute.snapshot.paramMap.get('id');

    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      userID: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required,Validators.minLength(6),Validators.maxLength(12)],
        asyncValidators: [this.IsUserIDExists.bind(this)]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(8)]
      }),
      confirmPassword: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
        asyncValidators: [this.passwordConfirming.bind(this)]
      }),
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email, Validators.maxLength(100)]
      }),
      preferredLanguageID: new FormControl('1', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(1)]
      }),

     });


    this.confirmSub = this.commonService.getLanguages()
                   .pipe(
                    filter(response => !!response),
                    switchMap(response => {
                    this.loadedLangs = response;
                    return this.regService.GetOTPVerifiedUserDetails(this.confirmationTrxID);
                    })
                    ).subscribe((response) => {

                      this.loadedUserInfo = response;
                      this.form.setValue({
                      firstName: this.loadedUserInfo.FullName,
                      lastName : '',
                      userID : '',
                      password : '',
                      confirmPassword : '',
                      email : this.loadedUserInfo.EmailAddress,
                      preferredLanguageID: `${this.loadedUserInfo.PreferredLanguageID}`,
                    });

                      this.form.markAsUntouched();


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

    this.translate.get('signupconfirm.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });
   
    this.translate.get('signupconfirm.step1').subscribe((res: string) => {
      this.step1 = res;
    });

    this.translate.get('signupconfirm.step2').subscribe((res: string) => {
      this.step2 = res;
    });

    this.translate.get('signupconfirm.step3').subscribe((res: string) => {
      this.step3 = res;
    });

    this.translate.get('signupconfirm.firstName').subscribe((res: string) => {
      this.firstName = res;
    });

    this.translate.get('signupconfirm.firstNamePlaceholder').subscribe((res: string) => {
      this.firstNamePlaceholder = res;
    });

    this.translate.get('signupconfirm.firstNameRequired').subscribe((res: string) => {
      this.firstNameRequired = res;
    });

    this.translate.get('signupconfirm.lastName').subscribe((res: string) => {
      this.lastName = res;
    });

    this.translate.get('signupconfirm.lastNamePlaceholder').subscribe((res: string) => {
      this.lastNamePlaceholder = res;
    });

    this.translate.get('signupconfirm.lastNameRequired').subscribe((res: string) => {
      this.lastNameRequired = res;
    });

    this.translate.get('signupconfirm.userID').subscribe((res: string) => {
      this.userID = res;
    });

    this.translate.get('signupconfirm.userIDPlaceholder').subscribe((res: string) => {
      this.userIDPlaceholder = res;
    });

    this.translate.get('signupconfirm.userIDRequired').subscribe((res: string) => {
      this.userIDRequired = res;
    });

    this.translate.get('signupconfirm.userIDTaken').subscribe((res: string) => {
      this.userIDTaken = res;
    });

    this.translate.get('signupconfirm.useridMinLenMsg').subscribe((res: string) => {
      this.useridMinLenMsg = res;
    });

    this.translate.get('signupconfirm.useridMaxLenMsg').subscribe((res: string) => {
      this.useridMaxLenMsg = res;
    });

     this.translate.get('signupconfirm.password').subscribe((res: string) => {
      this.password = res;
    });

    this.translate.get('signupconfirm.passwordPlaceholder').subscribe((res: string) => {
      this.passwordPlaceholder = res;
    });

    this.translate.get('signupconfirm.passwordRequired').subscribe((res: string) => {
      this.passwordRequired = res;
    });

    this.translate.get('signupconfirm.confirmpassword').subscribe((res: string) => {
      this.confirmpassword = res;
    });

    this.translate.get('signupconfirm.confirmpasswordPlaceholder').subscribe((res: string) => {
      this.confirmpasswordPlaceholder = res;
    });

    this.translate.get('signupconfirm.confirmpasswordMessage').subscribe((res: string) => {
      this.confirmpasswordMessage = res;
    });

    this.translate.get('signupconfirm.email').subscribe((res: string) => {
      this.email = res;
    });

    this.translate.get('signupconfirm.emailPlaceholder').subscribe((res: string) => {
      this.emailPlaceholder = res;
    });

    this.translate.get('signupconfirm.emailMessage').subscribe((res: string) => {
      this.emailMessage = res;
    });

    this.translate.get('signupconfirm.preferredLanguage').subscribe((res: string) => {
      this.preferredLanguage = res;
    });

    this.translate.get('signupconfirm.message').subscribe((res: string) => {
      this.message = res;
    });

    this.translate.get('signupconfirm.complete').subscribe((res: string) => {
      this.complete = res;
    });

    this.translate.get('signupconfirm.completeSuccess').subscribe((res: string) => {
      this.completeSuccess = res;
    });


    this.translate.get('signupconfirm.signup').subscribe((res: string) => {
      this.signup = res;
    });


    this.translate.get('signupconfirm.Ok').subscribe((res: string) => {
      this.Ok = res;
    });

    this.translate.get('signupconfirm.cancelText').subscribe((res: string) => {
      this.cancelText = res;
    });

  }


  IsUserIDExists(control: FormControl): Promise<any> | Observable<any> {

    const promis = new Promise<any>((res, rej) => {

    this.usrAvailChkrSub = this.regService.IsUserIDValid(this.form.get('userID').value).subscribe((resp) => {

    if (resp.ResponseCode !== '0') {
          res({userIDTaken: true});
        } else {
          res(null);
        }

      });

    });

    return promis;


  }

  passwordConfirming(c: FormControl): Promise<any> | Observable<any> {

    const promis = new Promise<any>((res,rej) => {

      setTimeout(() => {

        if (this.form.value.password !== c.value) {
            res({mismatched: true});
        } else {
          res(null);
        }

      }, 1000);

    });

    return promis;

}

   get errorControl() {
    return this.form.controls;
  }

  onCompleteRegistration() {

    this.isSubmitted = true;

    if (!this.form.valid) {
      return;
    }

    const pFirstName  =  this.form.value.firstName;
    const pLastName  =  this.form.value.lastName;
    const pUserID  =  this.form.value.userID;
    const pPassword  =  this.form.value.password;
    const pEmail  =  this.form.value.email;
    const pPreferredLanguageID  =  this.form.value.preferredLanguageID;


    const processInfo = new Registration(this.confirmationTrxID, pFirstName, pLastName, pUserID, pPassword,
                        pEmail, pPreferredLanguageID, this.loadedUserInfo.UserMobileNo);

    this.processRegistration(processInfo);
    this.form.reset();

  }

  processRegistration(regProcessInfo: Registration) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: this.complete })
      .then(loadingEl => {
        loadingEl.present();
        let regObs: Observable<RegProcessResponseData>;
        regObs = this.regService.processSignup(
                  regProcessInfo.ConfirmationTrxID, regProcessInfo.FirstName, regProcessInfo.LastName,
                  regProcessInfo.UserID, regProcessInfo.Password, regProcessInfo.EmailAddress,
                  regProcessInfo.PreferredLanguageID, regProcessInfo.UserMobileNo);
        this.completeSub = regObs.subscribe(
          resData => {
            this.isLoading = false;

            if (resData.ResponseCode !== '0') {
              this.isRegistrationFailed = true;
              return;
            }
            loadingEl.dismiss();
            this.presentConfirmRegistration(this.completeSuccess);
            } ,
          errRes => {
            loadingEl.dismiss();
            const message = errRes.error.ResponseDescription;
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

  private presentConfirmRegistration(msg: string) {
    this.alertCtrl
      .create({
        header: this.signup,
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
  


  ngOnDestroy() {

    if (this.confirmSub) {
      this.confirmSub.unsubscribe();
    }

    if (this.completeSub) {
      this.completeSub.unsubscribe();
    }

    if (this.usrAvailChkrSub) {
      this.usrAvailChkrSub.unsubscribe();      
    }
    
    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }
    

  }

}
