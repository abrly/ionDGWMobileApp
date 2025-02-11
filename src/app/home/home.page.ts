import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { LanguageswitcherPage } from './languageswitcher/languageswitcher.page';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  
  userName: string;
  lang: any;
  title: string;
  heading1: string;
  heading2: string;
  
  tollfreeNumber: string;
  contactMessage: string;
  Notification: string;

  loadedUserToken: string;
  MessageEn: string;
  MessageAr: string;

  

  greetingTextType:string;

  goodMoring:string;
  goodAfternoon:string;
  goodEvening:string;


  service1FirstName: string;
  service1LastName: string;
  service2FirstName: string;
  service2LastName: string;
  service3FirstName: string;
  service3LastName: string;
  service4FirstName: string;
  service4LastName: string;
  service5FirstName: string;
  service5LastName: string;



  subAppLang: Subscription;
  subHomeService: Subscription;
  
  
 
  constructor(private router: Router, public translate: TranslateService, private homeService: HomeService,
              public popoverController: PopoverController, private authService: AuthService) {

    this.lang = 'en';
    this.translate.setDefaultLang('en');
    this.translate.use('en');   

   }

   ionViewDidEnter(): void {
    this.getUserLanguage();

    //console.log('did u here');
    const todt = new Date();
    const hrs = todt.getHours();



    if ((hrs>0) && (hrs<12)) {

      this.greetingTextType="1";

      //console.log('1');
      
    } else if ((hrs>=12) && (hrs<16)) {

      this.greetingTextType="2";
      //console.log('2');

    } else if ((hrs>=17) && (hrs<24)) {

      

      this.greetingTextType="3";

      //console.log('3');

    }

  }
   
  async presentPopover(ev: any) {

    const popover = await this.popoverController.create({
      component: LanguageswitcherPage,
      cssClass: 'custom-popover',
      event: ev,
      translucent: true,
      componentProps: {
        lang: this.lang,
      }
    });
    return await popover.present();

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

    this.translate.get('title').subscribe((res: string) => {
      this.title = res;
    });

    this.translate.get('home.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });

    this.translate.get('home.heading2').subscribe((res: string) => {
      this.heading2 = res;
    });

    this.translate.get('home.service1FirstName').subscribe((res: string) => {
      this.service1FirstName = res;
    });
    this.translate.get('home.service1LastName').subscribe((res: string) => {
      this.service1LastName = res;
    });
    this.translate.get('home.service2FirstName').subscribe((res: string) => {
      this.service2FirstName = res;
    });
    this.translate.get('home.service2LastName').subscribe((res: string) => {
      this.service2LastName = res;
    });

    this.translate.get('home.service3FirstName').subscribe((res: string) => {
      this.service3FirstName = res;
    });
    this.translate.get('home.service3LastName').subscribe((res: string) => {
      this.service3LastName = res;
    });

    this.translate.get('home.service4FirstName').subscribe((res: string) => {
      this.service4FirstName = res;
    });
    this.translate.get('home.service4LastName').subscribe((res: string) => {
      this.service4LastName = res;
    });

    this.translate.get('home.service5FirstName').subscribe((res: string) => {
      this.service5FirstName = res;
    });
    this.translate.get('home.service5LastName').subscribe((res: string) => {
      this.service5LastName = res;
    });

    this.translate.get('home.tollfreeNumber').subscribe((res: string) => {
      this.tollfreeNumber = res;
    });
    this.translate.get('home.contactMessage').subscribe((res: string) => {
      this.contactMessage = res;
    });
    this.translate.get('home.Notification').subscribe((res: string) => {
      this.Notification = res;
    });    

    this.translate.get('home.goodMoring').subscribe((res: string) => {
      this.goodMoring = res;
    });

    this.translate.get('home.goodAfternoon').subscribe((res: string) => {
      this.goodAfternoon = res;
    });

    this.translate.get('home.goodEvening').subscribe((res: string) => {
      this.goodEvening = res;
    });



    
  }

  ngOnInit() {

    



    
    this.subHomeService = this.authService.userName
    .pipe(
     filter(response => !!response),
     switchMap(response => {

     // console.log('step 1 - user');
     // console.log(response);
      this.userName = response;
      return this.authService.token;
     }),
     filter(response => !!response),
     switchMap(response => {
      // console.log('step 2 - tokens');
      // console.log(response);
      this.loadedUserToken = response;
      return this.homeService.GetMessage(this.loadedUserToken);
     })
     ).subscribe((response) => {

      // console.log('messages');
      // console.log(response);

      this.MessageEn = 'Dear ' + this.userName + ' , ' + response.MessageEn;
      this.MessageAr = 'العزيز ' + this.userName + ' , ' + response.MessageAr;
      });

    

  }

  onClickActiveStatus(){
    this.router.navigate(['/', 'home', 'jobcards',{status:'active'}]);
  }

  onClickAllStatus(){
    this.router.navigate(['/', 'home', 'jobcards',{status:'all'}]);
  }

  onClickFeedback(){
    this.router.navigate(['/', 'home', 'feedback']);
  }


  onClickSearchCars(){
    this.router.navigate(['/', 'home', 'vehicleinfo']);
  }

  onClickAppointments(){
    this.router.navigate(['/', 'home', 'appointments']);
  }

  switchLanguage() {
    this.translate.use(this.lang);
  }

  ngOnDestroy() {

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }

    if (this.subHomeService) {
      this.subHomeService.unsubscribe();
    }
    
  }

}
