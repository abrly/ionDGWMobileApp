import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const BackendURL = environment.API_Prefix ;

export interface AccountHelperResponseData {
    ResponseCode: string;
    ResponseDescription: string;
}

@Injectable({
    providedIn: 'root'
  })

export class AccountHelperService {

    constructor(private http: HttpClient ) { }


    inititateAccountHelper(mobilePrefix: string, mobileno: string) {
        return this.http
          .post<AccountHelperResponseData>(
            BackendURL + 'initiateforgotpwd',
            { MobilePrefix : mobilePrefix , MobileNumber : mobileno}
          );
      }

      verifyAccountHelperOTP(mobileno: string, otp: number) {
        return this.http
          .post<AccountHelperResponseData>(
            BackendURL + 'verifyforgotpwd',
            { MobileNumber : mobileno, OTP: otp}
          );
        }

}