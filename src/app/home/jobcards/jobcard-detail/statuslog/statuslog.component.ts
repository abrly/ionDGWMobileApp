import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { StatusLog } from '../statuslog.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-statuslog',
  templateUrl: './statuslog.component.html',
  styleUrls: ['./statuslog.component.scss'],
})
export class StatuslogComponent  implements OnInit, OnDestroy {

  @Input() stslog: StatusLog;

  lang: string;
  statusDateTimeString: string;
  statusDesc: string;

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

    this.translate.get('statuslog.StatusDateTime').subscribe((res: string) => {
      this.statusDateTimeString = res;
    });

    this.translate.get('statuslog.StatusDesc').subscribe((res: string) => {
      this.statusDesc = res;
    });
  
  }
 
  ngOnDestroy() {

    if (this.subAppLang) {
      this.subAppLang.unsubscribe();
    }

  }

}
