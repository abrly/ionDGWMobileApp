import { Component, OnDestroy, OnInit } from '@angular/core';
//import { Geolocation } from '@ionic-native/geolocation';
import { Geolocation } from '@capacitor/geolocation';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import { AnonylanguageswitcherPage } from '../anonylanguageswitcher/anonylanguageswitcher.page';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

  heading1: string;
  heading2: string;
  userID: string;
  enterUserIDHelpText:string;
  userIDRequired: string;
  password: string;
  enterPwdHelpText:string;
  passwordRequired: string;
  switchToSignUp: string;
  login: string;
  forgotuserID: string;
  switchLanguage: string;
  switchLanguagePlaceholder: string;
  arabic: string;
  english: string;
  lang = 'en';
  isLoading = false;
  device: string;
  latitude: string;
  longitude: string;


  loggingIn: string;
  loginFailed: string;
  Ok: string;

  private subAppLang: Subscription;
  private subAuth: Subscription;

  constructor(
    //private geolocation: Geolocation,
    public platform: Platform,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public popoverController: PopoverController,
    public translate: TranslateService,
    private alertCtrl: AlertController) { }

  ngOnInit() {

    this.platform.ready().then( () => {
      if (this.platform.is('desktop')){
        this.device = 'desktop';
      } else if (this.platform.is('ios')){
        this.device = 'ios';
      } else if (this.platform.is('android')) {
        this.device = 'android';
      }
      });


      const printCurrentPosition = async () => {
        const coordinates = await Geolocation.getCurrentPosition();
        this.latitude = coordinates.coords.latitude.toString();
        this.longitude = coordinates.coords.longitude.toString();     
      };

/*
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude.toString();
      this.longitude = resp.coords.longitude.toString();
       }).catch((error) => {
         console.log('Error getting location', error);
       }); */

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

    this.translate.get('auth.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });

    this.translate.get('auth.heading2').subscribe((res: string) => {
      this.heading2 = res;
    });

    this.translate.get('auth.userID').subscribe((res: string) => {
      this.userID = res;
    });

    this.translate.get('auth.enteruserIDHelpText').subscribe((res: string) => {
      this.enterUserIDHelpText = res;
    });

    this.translate.get('auth.userIDRequired').subscribe((res: string) => {
      this.userIDRequired = res;
    });
    this.translate.get('auth.password').subscribe((res: string) => {
      this.password = res;
    });

    this.translate.get('auth.enterPwdHelpText').subscribe((res: string) => {
      this.enterPwdHelpText = res;
    });

    this.translate.get('auth.passwordRequired').subscribe((res: string) => {
      this.passwordRequired = res;
    });

    this.translate.get('auth.switchToSignUp').subscribe((res: string) => {
      this.switchToSignUp = res;
    });

    this.translate.get('auth.login').subscribe((res: string) => {
      this.login = res;
    });

    this.translate.get('auth.forgotuserID').subscribe((res: string) => {
      this.forgotuserID = res;
    });
    this.translate.get('auth.switchLanguage').subscribe((res: string) => {
      this.switchLanguage = res;
    });
    this.translate.get('auth.switchLanguagePlaceholder').subscribe((res: string) => {
      this.switchLanguagePlaceholder = res;
    });
    this.translate.get('auth.arabic').subscribe((res: string) => {
      this.arabic = res;
    });
    this.translate.get('auth.english').subscribe((res: string) => {
      this.english = res;
    });

    this.translate.get('auth.loggingIn').subscribe((res: string) => {
      this.loggingIn = res;
    });

    this.translate.get('auth.loginFailed').subscribe((res: string) => {
      this.loginFailed = res;
    });

    this.translate.get('auth.Ok').subscribe((res: string) => {
      this.Ok = res;
    });

  }

   async onSetPreferredLang(evt: any) {

    const appLang = evt.detail.value;

    if (appLang) {

      this.authService.setAnonyUserLanguage(appLang);
    }
  }

   onSwitchToRegistration(){

    this.router.navigate(['/', 'reg']);
   }

   authenticate(userID: string, password: string) {

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: this.loggingIn })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        authObs = this.authService.signin(userID, password, this.device, this.latitude, this.longitude);
        this.subAuth = authObs.subscribe(
          () => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigate(['/', 'home']);
          },
          errRes => {
            loadingEl.dismiss();
            let message: any = '';
            if (errRes.error){
               message = errRes.error.ResponseDescription;
            }
            this.showAlert(message);
          }
        );
      });
  }

  private showAlert(msg: string) {
    this.alertCtrl
      .create({
        header: this.loginFailed,
        message: msg,
        buttons: [this.Ok]
      })
      .then(alertEl => alertEl.present());
  }


   onSubmit(frmLogin: NgForm ) {

    if (!frmLogin.valid) {
      return;
    }

    const userID = frmLogin.value.userid;
    const password = frmLogin.value.password;
    this.authenticate(userID, password);
    frmLogin.reset();

  }

  onSwitchToAccountHelper() {
    this.router.navigate(['/', 'accounthelper']);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: AnonylanguageswitcherPage,
      cssClass: 'custom-popover',
      event: ev,
      translucent: true,
      componentProps: {
        lang: this.lang,
      }
    });
    return await popover.present();

}

  ngOnDestroy() {
      if (this.subAppLang) {
        this.subAppLang.unsubscribe();
      }
      if (this.subAuth) {
        this.subAuth.unsubscribe();
      }
  }

}
