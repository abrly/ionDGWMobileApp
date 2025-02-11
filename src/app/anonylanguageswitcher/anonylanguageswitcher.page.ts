import { Component, OnInit , Input  } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Lang } from 'src/app/app/common/models/lang.model';

@Component({
  selector: 'app-anonylanguageswitcher',
  templateUrl: './anonylanguageswitcher.page.html',
  styleUrls: ['./anonylanguageswitcher.page.scss'],
})
export class AnonylanguageswitcherPage implements OnInit {
  @Input() lang: string;

  appLang: Lang[] = [];

  constructor(private popoverController: PopoverController, private authService: AuthService) {}

  ngOnInit() {

    this.appLang.push
    (new Lang('ar', 'Arabic', '../../../assets/icon/LA_AR.png') , new Lang('en',  'English', '../../../assets/icon/LA_EN.png'));

  }

  async onSetPreferredLang(lng: string) {

    this.authService.setAnonyUserLanguage(lng);

    await this.popoverController.dismiss();

 }



}
