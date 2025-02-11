import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/app/common/common.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { LanguageData } from 'src/app/app/common/models/languagedata.model';
import { AuthService } from 'src/app/auth/auth.service';
import { filter, switchMap  } from 'rxjs/operators';
import { ResponseData, UpdateuserService } from './updateuser.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.page.html',
  styleUrls: ['./updateuser.page.scss'],
})
export class UpdateuserPage implements OnInit , OnDestroy {
 
  lang: string;
  isLoading = false;
  form: FormGroup;
  loadedLangs: LanguageData[];
  isSubmitted = false;
  loadedUserID: string;
  

  heading1: string;
  FirstName: string;
  FirstNameError: string;
  LastName: string;
  LastNameError: string;
  EMail: string;
  EMailError: string;
  Language: string;
  Update: string;

  loadedUserToken: string;

  profileUpdate: string;
  updateSuccess: string;
  Ok: string;
  cancelText: string;

  private authUsr: Subscription;
  private subAppLang: Subscription;
  private updateSub: Subscription;

  constructor(
    private updateUserService: UpdateuserService,
    private commonService: CommonService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    private router: Router) {}

  ngOnInit() {

    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
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


    this.authUsr = this.authService.token
                   .pipe(
                    filter(response => !!response),
                    switchMap(response => {
                    this.loadedUserToken = response;
                    return this.commonService.getLanguages();
                    }),
                    filter(response => !!response),
                    switchMap(response => {
                    this.loadedLangs = response;
                    return this.updateUserService.getUserInformation(this.loadedUserToken);
                    })
                    ).subscribe((response) => {
                      this.form.setValue({
                        firstName: response.FirstName,
                        lastName : response.LastName,
                        email : response.EmailAddress,
                        preferredLanguageID: `${response.PreferredLanguageID}`,
                      });

                      this.form.markAsUntouched();
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

    this.translate.get('profile.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });

    this.translate.get('profile.FirstName').subscribe((res: string) => {
      this.FirstName = res;
    });
    this.translate.get('profile.FirstNameError').subscribe((res: string) => {
      this.FirstNameError = res;
    });
    this.translate.get('profile.LastName').subscribe((res: string) => {
      this.LastName = res;
    });
    this.translate.get('profile.LastNameError').subscribe((res: string) => {
      this.LastNameError = res;
    });
    this.translate.get('profile.EMail').subscribe((res: string) => {
      this.EMail = res;
    });
    this.translate.get('profile.EMailError').subscribe((res: string) => {
      this.EMailError = res;
    });
    this.translate.get('profile.Language').subscribe((res: string) => {
      this.Language = res;
    });
    this.translate.get('profile.Update').subscribe((res: string) => {
      this.Update = res;
    });

    this.translate.get('profile.profileUpdate').subscribe((res: string) => {
      this.profileUpdate = res;
    });

    this.translate.get('profile.updateSuccess').subscribe((res: string) => {
      this.updateSuccess = res;
    });

    this.translate.get('profile.Ok').subscribe((res: string) => {
      this.Ok = res;
    });

    this.translate.get('profile.cancelText').subscribe((res: string) => {
      this.cancelText = res;
    });


  }

  onCompleteProfileUpdate(){

    this.isSubmitted = true;

    if (!this.form.valid) {
      return;
    }

    const pFirstName  =  this.form.value.firstName;
    const pLastName  =  this.form.value.lastName;
    const pEmail  =  this.form.value.email;
    const pPreferredLanguageID  =  this.form.value.preferredLanguageID;

    this.updateuserprofile(this.loadedUserID, pFirstName, pLastName, pEmail, pPreferredLanguageID);
    this.form.reset();


  }

  updateuserprofile(userID: string, firstName: string, lastName: string, email: string, prefLangID: number) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: this.profileUpdate })
      .then(loadingEl => {
        loadingEl.present();
        let updtObs: Observable<ResponseData>;
        updtObs = this.updateUserService.updateUserInformation(
          userID, firstName, lastName,
          email, prefLangID, userID, this.loadedUserToken);
        this.updateSub = updtObs.subscribe(
          resData => {
            this.isLoading = false;
            if (resData.ResponseCode !== '0') {
              return;
            }
            loadingEl.dismiss();

            this.presentConfirmUpdation
            (this.updateSuccess);
            } ,
          errRes => {
            loadingEl.dismiss();
            const message = errRes.error.ResponseDescription;
            this.presentConfirmUpdation(message);
          }
        );
      });


  }


  private presentConfirmUpdation(msg: string) {
    this.alertCtrl
      .create({
        header: this.profileUpdate,
        message: msg,
        buttons: [{
          text: this.Ok,
          role: 'ok',
          handler: () => {
            this.router.navigate(['/', 'home']);
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
    
    if (this.updateSub){
      this.updateSub.unsubscribe();
    }

  
  

  }

}
