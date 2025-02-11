import { NgModule } from '@angular/core';

//import { Geolocation } from '@ionic-native/geolocation/ngx';

//import { Geolocation } from '@capacitor/geolocation';

import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { SplashScreen } from '@capacitor/splash-screen';
//import { StatusBar } from '@ionic-native/status-bar/ngx';
//import { StatusBar, Style } from '@capacitor/status-bar';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AnonylanguageswitcherPage } from './anonylanguageswitcher/anonylanguageswitcher.page';
import { FilterswitcherPage } from './home/jobcards/filterswitcher/filterswitcher.page';

//import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';

import { NgCalendarModule  } from 'ionic2-calendar';


export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http,'./assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, AnonylanguageswitcherPage,FilterswitcherPage],
  //,entryComponents: [AnonylanguageswitcherPage,FilterswitcherPage],
  imports:
    [BrowserModule,FormsModule,ReactiveFormsModule,
      CommonModule, HttpClientModule,NgCalendarModule, IonicModule.forRoot({scrollAssist: true, backButtonText: ''}), TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    }
  }), AppRoutingModule],
  providers: [
    //Geolocation,
    //StatusBar,
    //SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
    //,NetworkInterface
  ],
  bootstrap: [AppComponent]

})
export class AppModule {}
