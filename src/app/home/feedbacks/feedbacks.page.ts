import { Component, ElementRef, ViewChild, OnInit,  OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';

import { LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { Observable , Subscription } from 'rxjs';
import { filter, switchMap  } from 'rxjs/operators';
import { ServiceType } from '../../home/servicetype.model';
import { FeedbackResponse, FeedbackService } from './feedback.service';
import { FeedbackType } from './feedbacktype.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';




@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.page.html',
  styleUrls: ['./feedbacks.page.scss'],
})
export class FeedbacksPage implements OnInit, OnDestroy {

  lang: any;
  loadedUserToken: string;
  feedbackSubmissionDone: boolean;
  public serviceTypes: ServiceType[];
  public feedbackTypes: FeedbackType[];


  serviceTypeID: number;
  feedbackTypeID: number;
  form: FormGroup;

  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;

  photo: SafeResourceUrl;
  isDesktop: boolean;
  heading1: string;
  ServiceTypes: string;
  ServiceTypesPlaceholder: string;
  FeedbackTypes: string;
  FeedbackTypesPlaceholder: string;
  Message: string;
  MessagePlaceHolder: string;
  AddUpdateAttachment: string;
  SubmitFeedback: string;
  SubmissionSuccessResult: string;
  Dismiss: string;

  Attachment: string;
  Camera: string;
  Gallery: string;

  feedbackSubmission: string;
  Ok: string;

  private authUsr: Subscription;
  private subAppLang: Subscription;
  private subFeedback: Subscription;

  constructor( private alertCtrl: AlertController, private authService: AuthService,
               private sanitizer: DomSanitizer, private feedbackService: FeedbackService, public translate: TranslateService,
               private router: Router, private loadingCtrl: LoadingController, private actionSheetController: ActionSheetController) { }

  ngOnInit() {

    this.authUsr = this.authService.token
                   .pipe(
                    filter(response => !!response),
                    switchMap(response => {
                    this.loadedUserToken = response;
                    return this.feedbackService.getServiceTypes(this.loadedUserToken);
                    }),
                    filter(response => !!response),
                    switchMap(response => {
                    this.serviceTypes = response;
                    return this.feedbackService.getFeedBackTypes(this.loadedUserToken);
                    })
                    ).subscribe((response) => {
                      this.feedbackTypes = response;
                    });


    this.form = new FormGroup({
      serviceTypeID: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      feedbackTypeID: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      feedbackMessage: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      image: new FormControl(null)
    });

    

  }

  ionViewDidEnter(): void {
    this.getUserLanguage();
    this.photo = null;
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

    this.translate.get('feedback.heading1').subscribe((res: string) => {
      this.heading1 = res;
    });

    this.translate.get('feedback.ServiceTypes').subscribe((res: string) => {
      this.ServiceTypes = res;
    });
    this.translate.get('feedback.ServiceTypesPlaceholder').subscribe((res: string) => {
      this.ServiceTypesPlaceholder = res;
    });
    this.translate.get('feedback.FeedbackTypes').subscribe((res: string) => {
      this.FeedbackTypes = res;
    });
    this.translate.get('feedback.FeedbackTypesPlaceholder').subscribe((res: string) => {
      this.FeedbackTypesPlaceholder = res;
    });
    this.translate.get('feedback.Message').subscribe((res: string) => {
      this.Message = res;
    });
    this.translate.get('feedback.MessagePlaceHolder').subscribe((res: string) => {
      this.MessagePlaceHolder = res;
    });
    this.translate.get('feedback.AddUpdateAttachment').subscribe((res: string) => {
      this.AddUpdateAttachment = res;
    });
    this.translate.get('feedback.SubmitFeedback').subscribe((res: string) => {
      this.SubmitFeedback = res;
    });
    this.translate.get('feedback.SubmissionSuccessResult').subscribe((res: string) => {
      this.SubmissionSuccessResult = res;
    });
    this.translate.get('feedback.Dismiss').subscribe((res: string) => {
      this.Dismiss = res;
    });

    this.translate.get('feedback.Attachment').subscribe((res: string) => {
      this.Attachment = res;
    });

    this.translate.get('feedback.Camera').subscribe((res: string) => {
      this.Camera = res;
    });

    this.translate.get('feedback.Gallery').subscribe((res: string) => {
      this.Gallery = res;
    });

    this.translate.get('feedback.feedbackSubmission').subscribe((res: string) => {
      this.feedbackSubmission = res;
    });

    this.translate.get('feedback.Ok').subscribe((res: string) => {
      this.Ok = res;
    });


  }


  onCreateFeedback() {

    if (!this.form.valid) {
      return;
    }

    this.feedbackSubmissionDone = false;

    const srvTypeID  =  this.form.value.serviceTypeID;
    const fbTypeID  =  this.form.value.feedbackTypeID;
    const fbMsg = this.form.value.feedbackMessage;
    const fbattachment = this.form.get('image').value;

    this.loadingCtrl
    .create({
      message : this.feedbackSubmission
    })
    .then((loadEl) => {

      loadEl.present();
      let fbObs: Observable<FeedbackResponse>;

      fbObs = this.feedbackService.addFeedback(srvTypeID, fbTypeID, fbMsg, fbattachment, this.loadedUserToken);

      this.subFeedback = fbObs.subscribe((resp) => {

          if (resp.ResponseCode === '0'){

            loadEl.dismiss();
            this.form.reset();
            this.feedbackSubmissionDone = true;

            this.presentConfirmSubmission(this.SubmissionSuccessResult);


          } else {

            this.feedbackSubmissionDone = false;
            loadEl.dismiss();

          }

      });


    }).catch((err) => {

      this.feedbackSubmissionDone = false;

    });

  }


  private presentConfirmSubmission(msg: string) {
    this.alertCtrl
      .create({
        header: this.feedbackSubmission,
        message: msg,
        buttons: [{
          text: this.Ok,
          role: 'ok',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }]
      })
      .then(alertEl => alertEl.present());
  }


  /* region "attachments" start */


  getAttachmentOptions() {

    this.presentActionSheet();

  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: this.Attachment,
      cssClass: 'my-custom-class',
      buttons: [{
        text: this.Camera,
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.getPicture('camera');
        }
      }, {
        text: this.Gallery,
        icon: 'image',
        handler: () => {
          this.getPicture('gallery');
        }
      },
      {
        text: this.Dismiss,
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }



  async getPicture(type: string) {

   /* if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')) {
      this.filePickerRef.nativeElement.click();
      return;
    } */

    if (this.isDesktop && type === 'gallery') {
      this.filePickerRef.nativeElement.click();
      return;
    } 

    //console.log('what is type');
    //console.log(type);

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    //var imageUrl = image.webPath;

   /* console.log('what is web path');
    console.log(imageUrl);*/

    //this.photo= imageUrl;

    //this.form.patchValue({ image: image.dataUrl });
   
    

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));    

    const typePart = image.dataUrl.substr(0, 22);
    const dataPart = image.dataUrl.substr(22);
    const fileSize = (dataPart.length * (3 / 4)) - 2;

    if ((fileSize <= 1033414.75) && (typePart === 'data:image/jpeg;base64')) {
      this.form.patchValue({ image: image.dataUrl });
    } else {
        this.presentFileException('Please upload a JPEG file with the maximum size of 1 MB');
        this.photo = null;
    }

   


  }




  private presentFileException(msg: string) {
    this.alertCtrl
      .create({
        header: this.feedbackSubmission,
        message: msg,
        buttons: [{
          text: this.Ok,
          role: 'ok',
          handler: () => {
            //
          }
        }]
      })
      .then(alertEl => alertEl.present());
  }




  /* region "attachments" end */


  ngOnDestroy() {

    if (this.authUsr) {
      this.authUsr.unsubscribe();
    }

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
     }

    if (this.subFeedback) {
      this.subFeedback.unsubscribe();
    }

  }


}
