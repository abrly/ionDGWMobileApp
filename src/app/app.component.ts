import { Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { AlertController, IonRouterOutlet, Platform} from '@ionic/angular';
import {  Capacitor  } from '@capacitor/core';

//import {  Capacitor  } from '@capacitor/core';

//import { PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/push-notifications';

//import { PushNotification } from '@PushNotification';

import { ActionPerformed, PushNotifications,Token } from '@capacitor/push-notifications';

import { DocumentService } from './document.service';
import { AuthService } from './auth/auth.service';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

//const { App } = Plugins;
//const { PushNotifications, Modals } = Plugins;

//import { AnyPlugin } from 'any-plugin';

import { SplashScreen } from '@capacitor/splash-screen';

//import { App } from '@capacitor/app';

import { App as CapacitorApp } from '@capacitor/app';

import { Location } from '@angular/common';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})


export class AppComponent implements OnInit, OnDestroy {


  routerHidden = true;
  @ViewChild('splsh', {static: false}) splsh: ElementRef;
  lang: string;
  appDir: string;

  title: string;
  updateProfile: string;
  logout: string;
  wantToLogout: string;
  cancel: string;
  Ok: string;

  AlertText:string;
  ConfirmMessageText:string;
  YesText:string;
  NoText:string;


  ipCapturing:Subscription;
  subAppLang: Subscription;
  subAppAnonyLang: Subscription;

  public unsubscribeBackEvent: any;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private documentService: DocumentService,
    public alertController: AlertController,
    public translate: TranslateService ,
    private _location: Location
    
    ) {
 
      this.platform.ready().then(() => {

        SplashScreen.hide();
        setTimeout(() => {
          this.routerHidden = false;
          this.splsh.nativeElement.style.display = 'none';

       /*   this.ipCapturing=this.authService.getMyIP().this.service.function
            .subscribe(arg => this.property = arg); */
          
          

        }, 9000);

      
        

     /* this.networkInterface.getCarrierIPAddress()
        .then(address => console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`))
        .catch(error => console.error(`Unable to get IP: ${error}`)); */



        this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
          console.log('Back press handler!');
          if (this._location.isCurrentPathEqualTo('/home')) {
            // Show Exit Alert!
            console.log('Show Exit Alert!');
            this.showExitConfirm();
            processNextHandler();
          } else {
            // Navigate to back page
            console.log('Navigate to back page');
            this._location.back();
          }
        });

      });




    

       /*

        this.platform.backButton.subscribeWithPriority(9999, () => {
         
          document.addEventListener("backbutton", function(event) {

          //  console.log(window.history.back());           

            window.history.back();
         
          }, false); 

        }); 


      }); */

    
        
  }

 /* backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routerOutlets.forEach(async(outlet: IonRouterOutlet) => {
        if (this.router.url != '/home') {
          // await this.router.navigate(['/']);
          await this.location.back();
        } else if (this.router.url === '/home') {
          if (new Date().getTime() - this.lastTimeBackPress >= this.timePeriodToExit) {
            this.lastTimeBackPress = new Date().getTime();
            this.presentAlertConfirm();
          } else {
            navigator['app'].exitApp();
          }
        }
      });
    });
  } 

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      // header: 'Confirm!',
      message: 'Are you sure you want to exit the app?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {}
      }, {
        text: 'Close App',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });
  
    await alert.present();
  } 
 */



  /*
  initializeApp() {
    this.platform.ready().then(() => {


      SplashScreen.hide();
        setTimeout(() => {
          this.routerHidden = false;
          this.splsh.nativeElement.style.display = 'none';
        }, 9000);


        
        this.platform.backButton.subscribeWithPriority(9999, () => {
          document.addEventListener("backbutton", function(event) {
               console.log('backputtonpress');
            
              if (!this.routerOutlet.canGoBack()) {
                  this.showExitConfirm();
              } else {
                window.history.back();
              }


          }, false); });

    });

     
  } */

  
  showExitConfirm() {
    this.alertController.create({
      header: this.AlertText,
      message: this.ConfirmMessageText,
      backdropDismiss: false,
      buttons: [{
        text: this.NoText,
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');         
          this.router.navigate(['/', 'home' ]);
        }
      }, {
        text: this.YesText,
        handler: () => {
          CapacitorApp.exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  } 


  ngOnInit() {


    this.subAppAnonyLang = this.authService.anonyUserLang.subscribe((lang) => {

      if (lang === 'ar') {
        this.documentService.setReadingDirection('rtl');
        this.lang = 'ar';
      } else {
        this.documentService.setReadingDirection('ltr');
        this.lang = 'en';
      }

      this._initTranslate(this.lang);

     });

    this.subAppLang = this.authService.userLang.subscribe((lang) => {

      if (lang === 'ar') {
        this.documentService.setReadingDirection('rtl');
        this.lang = 'ar';



      } else {
        this.documentService.setReadingDirection('ltr');
        this.lang = 'en';
      }

      this.lang = lang;

      if (this.lang=='en'){

        this.AlertText="Alert";
        this.ConfirmMessageText="Do you want to close the app?";
        this.YesText="Yes";
        this.NoText="No";

      }
      else {

        this.AlertText="تحذير";
        this.ConfirmMessageText="هل تريد إغلاق التطبيق؟";
        this.YesText="نعم";
        this.NoText="لا";

      }
      this._initTranslate(this.lang);


     });

   /* const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (isPushNotificationsAvailable) {
      this.GoforPushNotifications();
    } */

  }

  GoforPushNotifications(){
     // PUSH NOTIFICATIONS..

     // Register with Apple / Google to receive push via APNS/FCM
     PushNotifications.register();

     // On succcess, we should be able to receive notifications
     PushNotifications.addListener('registration',
       (token: Token) => {
        // alert('Push registration success, token: ' + token.value);
        // console.log('Push registration success, token: ' + token.value);
       }
     );
 
     // Some issue with our setup and push will not work
     PushNotifications.addListener('registrationError',
       (error: any) => {
         alert('Error on registration: ' + JSON.stringify(error));
       }
     );
 
     // Show us the notification payload if the app is open on our device
    /* PushNotifications.addListener('pushNotificationReceived',
       (notification: Notification) => {
         const audio1 = new Audio('assets/audio.mp3');
         audio1.play();
         const alertRet = Models.alert({
           title: notification.title,
           message: notification.body
         });
 
       }
     ); */
 
     // Method called when tapping on a notification
     PushNotifications.addListener('pushNotificationActionPerformed',
       (notification: ActionPerformed) => {
         alert('Push action performed: ' + JSON.stringify(notification));
        // console.log('Push action performed: ' + notification);
       }
     );


  }


  _initTranslate(language) {

   // console.log('what is my app lang');
   // console.log(language);

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

    this.translate.get('title').subscribe((res: string) => {
      this.title = res;
    });

    this.translate.get('updateProfile').subscribe((res: string) => {
      this.updateProfile = res;
    });

    this.translate.get('logout').subscribe((res: string) => {
      this.logout = res;
    });

    this.translate.get('wantToLogout').subscribe((res: string) => {
      this.wantToLogout = res;
    });

    this.translate.get('cancel').subscribe((res: string) => {
      this.cancel = res;
    });

    this.translate.get('Ok').subscribe((res: string) => {
      this.Ok = res;
    });


    
  }


  onProfileUpdate() {
    this.router.navigate(['/', 'home', 'profileupdate' ]);
  }


  async presentLogoutConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.logout,
      message: this.wantToLogout,
      buttons: [
        {
          text: this.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.Ok,
          handler: () => {
            this.authService.logout();
            this.router.navigateByUrl('/auth');
          }
        }
      ]
    });

    await alert.present();
  }

  

   ngOnDestroy() {

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }

    if (this.subAppAnonyLang) {
      this.subAppAnonyLang.unsubscribe();
    }

  }
}
