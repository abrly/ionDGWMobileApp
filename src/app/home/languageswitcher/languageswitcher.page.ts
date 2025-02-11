import { Component, OnInit , OnDestroy, Input  } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Lang } from 'src/app/app/common/models/lang.model';



@Component({
  selector: 'app-languageswitcher',
  templateUrl: './languageswitcher.page.html',
  styleUrls: ['./languageswitcher.page.scss'],
})
export class LanguageswitcherPage implements OnInit , OnDestroy {

  @Input() lang: string;
  appLang: Lang[] = [];
  
  subSwitchAppLang: Subscription;

  constructor(private popoverController: PopoverController, private authService: AuthService) {

  }

  ngOnInit() {

    this.appLang.push
    (new Lang('ar', 'Arabic', '../../../assets/icon/LA_AR.png') , new Lang('en',  'English', '../../../assets/icon/LA_EN.png'));


  }

  async onSetPreferredLang(lng: string) {

    let langSwitched = false;

    this.subSwitchAppLang = this.authService.switchAppLanguage(lng).subscribe((result) => {

        langSwitched = true;

      });

    await this.popoverController.dismiss();

 }



  ngOnDestroy() {

    if (this.subSwitchAppLang) {
      this.subSwitchAppLang.unsubscribe();
    }

  }


}
