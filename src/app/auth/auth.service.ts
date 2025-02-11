import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
// import { Plugins } from '@capacitor/core';

//import { Storage } from '@capacitor/storage';
import { Preferences } from '@capacitor/preferences';

import { User } from './user.model';
import { UserLanguage } from './userlanguage.model';

//import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';

const BackendURL = environment.API_Prefix ;


export interface AuthResponseData {
  ResponseCode: string;
  ResponseDescription: string;
  UserID: string;
  FullName: string;
  UserToken: string;
  PreferredLangCode: string;
  DeptNo: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  
  private usr = new BehaviorSubject<User>(null);
  private usrLang = new BehaviorSubject<UserLanguage>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient) { }

  setAnonyUserLanguage(lang: string){

    const userLang = new UserLanguage(
      lang
    );

    this.usrLang.next(userLang);

  }
  
  get anonyUserLang() {
    return this.usrLang.asObservable().pipe(
      map(lng => {
        if (lng) {
          return lng.Lang;
        } else {
          return 'en';
        }
      })
    );
  }


 
  get userIsAuthenticated() {
    return this.usr.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
         } else {
          return false;
        }
      })
    );
  }

  get userID() {
    return this.usr.asObservable().pipe(
      map(user => {
        if (user) {
          return user.UserID;
        } else {
          return null;
        }
      })
    );
  }

  get userName() {
    return this.usr.asObservable().pipe(
      map(user => {
        if (user) {
          return user.Name;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this.usr.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  get userDeptNo() {
    return this.usr.asObservable().pipe(
      map(user => {
        if (user) {
          return user.DeptNo;
        } else {
          return null;
        }
      })
    );
  }
  
  get userLang() {
    return this.usr.asObservable().pipe(
      map(user => {
        if (user) {
          return user.preferredlang;
        } else {
          return 'en';
        }
      })
    );
  }

  switchAppLanguage(lang: string) {
    return from(Preferences.get({ key: 'authData' })).pipe(
      map(storedData => {

        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          UserID: string;
          FullName: string;
          UserToken: string;
          UserLang: string;
          DeptNo: string;
        };
        const user = new User(
          parsedData.UserID,
          parsedData.FullName,
          parsedData.UserToken,
          lang,
          parsedData.DeptNo
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this.usr.next(user);
          // this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

 /* getMyIP(){


    var json = 'http://ipv4.myexternalip.com/json';

    var pms = this.http.get(json);

    const observable = from(pms);

    

  }*/


  autoLogin() {


   


    return from(Preferences.get({ key: 'authData' })).pipe(
      map(storedData => {

        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          UserID: string;
          FullName: string;
          UserToken: string;
          UserLang: string;
          DeptNo: string;
        };
        const user = new User(
          parsedData.UserID,
          parsedData.FullName,
          parsedData.UserToken,
          parsedData.UserLang,
          parsedData.DeptNo,
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this.usr.next(user);
          // this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }



  signin(userID: string, pwd: string, device: string, latitude: string, longitude: string ) {
    return this.http
      .post<AuthResponseData>(
        BackendURL + 'authenticate',
        { UserID : userID, Password: pwd, Device : device, Latitude : latitude, Longitude : longitude  }
      ).pipe(tap(this.setUserData.bind(this)));
  }


  updateLastLogin(userID: string, pwd: string, device: string, latitude: string, longitude: string ) {
    return this.http
      .post<AuthResponseData>(
        BackendURL + 'updatelastlogindata',
        { UserID : userID, Password: pwd, Device : device, Latitude : latitude, Longitude : longitude  }
      );
  }

  private setUserData(userData: AuthResponseData) {

    const authUserID: string = userData?.UserID;
    const authUserName: string = userData?.FullName;
    const authToken: string = userData?.UserToken;
    const preferredLang: string = userData?.PreferredLangCode;
    const deptNo: string = userData?.DeptNo;

    const user = new User(
      authUserID,
      authUserName,
      authToken,
      preferredLang,
      deptNo,
    );

    //console.log('what ios ik');
    //console.log(userData);
    //console.log(user);

    this.usr.next(user);
  
    this.storeAuthData(
      authUserID,
      authUserName,
      authToken,
      preferredLang,
      deptNo
    ); 


 
  }

  /*
  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);

  } */

  private storeAuthData(
    userID: string,
    fullName: string,
    token: string,
    preferredLang: string,
    deptNo:string
  ) {

    const fullAuthToken = JSON.stringify({
      UserID: userID,
      FullName: fullName,
      UserToken: token,
      UserLang: preferredLang,
      DeptNo:deptNo
    });

    Preferences.set({ key: 'authData', value: fullAuthToken });

  }
  

  logout() {

    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.usr.next(null);
    Preferences.remove({ key: 'authData' });

  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

}
