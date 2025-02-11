import { Component, OnInit , Input, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { Reginitiation } from '../../registration/models/reginitiation.model';
import { AccountHelperService } from '../accounthelper.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-verifyuser-otp',
  templateUrl: './verifyuser-otp.component.html',
  styleUrls: ['./verifyuser-otp.component.scss'],
})
export class VerifyuserOTPComponent implements OnInit, OnDestroy {

  @Input() regUser: Reginitiation;
  @Input() lang: string;
  

  timer: string;
  heading1: string;
  step1: string;
  step2: string;
  an: string;
  OTP: string;
  isSent: string;
  isSentDetails: string;
  secs: string;
  otpPlaceholder: string;
  confirm: string;
  cancel: string;


  private regVerifySubscription = new Subscription();

  constructor(private modalctrl: ModalController,
              public translate: TranslateService,
              private accountHelperService: AccountHelperService) { }
  

  ngOnInit() {

    this.getUserLanguage();

    let countdown = 50;
    this.timer = countdown.toString();
    setInterval(() => {
          countdown = --countdown;
          if (countdown === 0) {
            this.modalctrl.dismiss(null, 'cancel');
          }
          this.timer = countdown.toString();
    }, 1000);


  }
  

  getUserLanguage() {

      this._initTranslate(this.lang);

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

    this.translate.get('accounthelperotp.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });
   
    this.translate.get('accounthelperotp.step1').subscribe((res: string) => {
      this.step1 = res;
    });
    this.translate.get('accounthelperotp.step2').subscribe((res: string) => {
      this.step2 = res;
    });
    this.translate.get('accounthelperotp.an').subscribe((res: string) => {
      this.an = res;
    });
    this.translate.get('accounthelperotp.OTP').subscribe((res: string) => {
      this.OTP = res;
    });
    this.translate.get('accounthelperotp.isSent').subscribe((res: string) => {
      this.isSent = res;
    });
    this.translate.get('accounthelperotp.isSentDetails').subscribe((res: string) => {
      this.isSentDetails = res;
    });
    this.translate.get('accounthelperotp.secs').subscribe((res: string) => {
      this.secs = res;
    });
    this.translate.get('accounthelperotp.otpPlaceholder').subscribe((res: string) => {
      this.otpPlaceholder = res;
    });
    this.translate.get('accounthelperotp.confirm').subscribe((res: string) => {
      this.confirm = res;
    });
    this.translate.get('accounthelperotp.cancel').subscribe((res: string) => {
      this.cancel = res;
    });

  }

  onConfirm(otpInfo: string) {

    this.regVerifySubscription = this.accountHelperService.verifyAccountHelperOTP(this.regUser.mobileno, +otpInfo)
    .subscribe((res) => {
 
        if (res.ResponseCode === '0')
        {
          this.modalctrl.dismiss({ isVerificationDone: true }, 'confirm');
        } else
        {
          this.modalctrl.dismiss({ isVerificationDone : false}, 'confirm');
        }

    });


  }




  onCancel() {
      this.modalctrl.dismiss(null, 'cancel');
  }

  ngOnDestroy() {
    if (this.regVerifySubscription) {
      this.regVerifySubscription.unsubscribe();
    }
  }

}
