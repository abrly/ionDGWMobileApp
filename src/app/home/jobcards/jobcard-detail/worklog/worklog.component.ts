import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { WorkLog } from '../worklog.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-worklog',
  templateUrl: './worklog.component.html',
  styleUrls: ['./worklog.component.scss'],
})
export class WorklogComponent implements OnInit, OnDestroy {
  @Input() wrklog: WorkLog;

  lang: string;
  LogDateTime: string;
  JobSite: string;

  private subAppLang: Subscription;

  constructor(private authService: AuthService, private translate: TranslateService) { }

  ngOnInit() {
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

    this.translate.get('worklog.LogDateTime').subscribe((res: string) => {
      this.LogDateTime = res;
    });

    this.translate.get('worklog.JobSite').subscribe((res: string) => {
      this.JobSite = res;
    });
  
  }
 
  ngOnDestroy() {

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }

  }



}
