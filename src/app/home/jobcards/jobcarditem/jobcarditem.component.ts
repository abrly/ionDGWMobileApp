import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jobcarditem',
  templateUrl: './jobcarditem.component.html',
  styleUrls: ['./jobcarditem.component.scss'],
})
export class JobcarditemComponent implements OnInit , OnDestroy {
  lang: string;
  jobTypeText:string;
  @Input() equipmentDesc: string;
  @Input() equipmentYear: string;
  @Input() workOrderID: string;
  @Input() WorkOrderStatus: string;
  @Input() WorkOrderStatusID: number;
  @Input() EQLicense:string;
  @Input() RepairReason:string;
  @Input() RepairReasonAr:string;

  private subAppLang: Subscription;

  constructor(private authService: AuthService, public translate: TranslateService) { }

  ngOnInit() {

    this.getUserLanguage();
  }


  getUserLanguage() {

    this.subAppLang = this.authService.userLang.subscribe((lang) => {

      this._initTranslate(lang);

      if (lang === 'ar') {
        if (this.WorkOrderStatus === 'Pending') {
          this.WorkOrderStatus = 'قيد الانتظار';
        } else if (this.WorkOrderStatus === 'Completed') {
          this.WorkOrderStatus = 'منجز';
        }  else if (this.WorkOrderStatus === 'Closed') {
          this.WorkOrderStatus = 'مغلق';
        }
      }

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

    if (this.lang=='en'){
      this.jobTypeText ="Job Type :";
    } else{
      this.jobTypeText ="نوع العمل:";
    }


  }

  onChangeStatusColor(status: number) {

    if (status === 1) {
      return 'primary';
    } else if (status === 2)  {
      return 'secondary';
    } else if (status === 3)  {
      return 'success';
    }

  }

  ngOnDestroy() {

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }


  }

}
