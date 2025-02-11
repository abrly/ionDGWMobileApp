import { Component, OnInit , Input, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { RegistrationService } from '../registration.service';
import { Reginitiation } from '../models/reginitiation.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verifyregistration',
  templateUrl: './verifyregistration.component.html',
  styleUrls: ['./verifyregistration.component.scss'],
})
export class VerifyregistrationComponent implements OnInit , OnDestroy {

  @Input() regUser: Reginitiation;
  @Input() lang: string;

  timer: string;
  heading1: string;
  step1: string;
  step2: string;
  step3: string;
  an: string;
  OTP: string;
  isSent: string;
  isSentDetails: string;
  secs: string;
  otpPlaceholder: string;
  didnotreceiveOTP: string;
  resendOTP: string;
  confirm: string;
  cancel: string;

  regVerifySubscription = new Subscription();

  constructor(private modalctrl: ModalController,
              public translate: TranslateService,
              private regservice: RegistrationService) { }




  ngOnInit() {

    this.getUserLanguage();

    let countdown = 60;
    this.timer = countdown.toString();
    setInterval(() => {
          countdown = --countdown;
          if (countdown === 0) {

            if (this.modalctrl){             
              this.modalctrl.dismiss(null, 'cancel');
            }
            
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

this.translate.get('signupotp.heading1').subscribe((res: string) => {
  this.heading1 = res;
});

this.translate.get('signupotp.step1').subscribe((res: string) => {
  this.step1 = res;
});
this.translate.get('signupotp.step2').subscribe((res: string) => {
  this.step2 = res;
});
this.translate.get('signupotp.step3').subscribe((res: string) => {
  this.step3 = res;
});
this.translate.get('signupotp.an').subscribe((res: string) => {
  this.an = res;
});
this.translate.get('signupotp.OTP').subscribe((res: string) => {
  this.OTP = res;
});
this.translate.get('signupotp.isSent').subscribe((res: string) => {
  this.isSent = res;
});
this.translate.get('signupotp.isSentDetails').subscribe((res: string) => {
  this.isSentDetails = res;
});
this.translate.get('signupotp.secs').subscribe((res: string) => {
  this.secs = res;
});
this.translate.get('signupotp.otpPlaceholder').subscribe((res: string) => {
  this.otpPlaceholder = res;
});
this.translate.get('signupotp.didnotreceiveOTP').subscribe((res: string) => {
  this.didnotreceiveOTP = res;
});
this.translate.get('signupotp.resendOTP').subscribe((res: string) => {
  this.resendOTP = res;
});
this.translate.get('signupotp.confirm').subscribe((res: string) => {
  this.confirm = res;
});
this.translate.get('signupotp.cancel').subscribe((res: string) => {
  this.cancel = res;
});

}



  onConfirm(otpInfo: string) {

    this.regVerifySubscription = this.regservice.verifySignupOTP(this.regUser.mobileno, +otpInfo)
    .subscribe((res) => {
        if (res.ResponseCode === '0')
        {
          this.modalctrl.dismiss({ isVerificationDone: true, confirmationTrxID : res.ConfirmationTrxID }, 'confirm');
        } else
        {
          this.modalctrl.dismiss({ isVerificationDone : false, confirmationTrxID : -1 }, 'confirm');
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
