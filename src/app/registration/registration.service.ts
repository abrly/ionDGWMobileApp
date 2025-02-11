import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MobilePrefixData } from './models/mobileprefixdata.model';

const BackendURL = environment.API_Prefix ;

export interface RegResponseData {
  ResponseCode: string;
  ResponseDescription: string;
  UserMobileNo: string;
}


export interface RegVerifyResponseData {
  ResponseCode: string;
  ResponseDescription: string;
  ConfirmationTrxID: number;
}

export interface VerifiedUserResponseData {
  ResponseCode: string;
  ResponseDescription: string;
  UserMobileNo: string;
  FullName: string;
  UserTypeID: number;
  UserTypeDescription: string;
  UserTypeDescriptionAr: string;
  OperatorCode: string;
  DepartmentCode: string;
  EmailAddress: string;
  PreferredLanguageID: string;
  PreferredLanguageName: string;
  PreferredLanguageNameAr: string;
}

export interface RegProcessResponseData {
  ResponseCode: string;
  ResponseDescription: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient ) { }

  getMobilePrefixes() {
    return this.http
      .get<MobilePrefixData[]>(
        BackendURL + 'getmobileprefixs',
      );
  }

  isUserRegExists(mobileno: string) {
    return this.http
      .get<RegProcessResponseData>(
        BackendURL + 'isuserregexists?MobileNumber=' +  mobileno
      );
  }

  inititateSignup(mobilePrefix: string, mobileno: string) {
    return this.http
      .post<RegResponseData>(
        BackendURL + 'initiatereg',
        { MobilePrefix : mobilePrefix , MobileNumber : mobileno}
      );
  }


  resendRegOTP(mobileno: string) {
    return this.http
      .post<RegResponseData>(
        BackendURL + 'resendregotp',
        { MobileNumber : mobileno}
      );
  }

  verifySignupOTP(mobileno: string, otp: number) {
    return this.http
      .post<RegVerifyResponseData>(
        BackendURL + 'verifyreg',
        { MobileNumber : mobileno, OTP: otp}
      );
    }


  GetOTPVerifiedUserDetails(TrxID: number) {
      return this.http
        .get<VerifiedUserResponseData>(
          BackendURL + 'getregverifiedusr' + '/?ConfirmationTrxID=' + TrxID);
      }


  

    IsUserIDValid(userID: string) {
      return (this.http
        .get<RegProcessResponseData>(
          BackendURL + 'getreguseridvalid' + '/?UserID=' + userID));
      }


  processSignup(confirmationTrxID: number, firstName: string, lastName: string, userid: string, password: string,
                email: string , prefferedLang: number , mobileno: string) {
    return this.http
      .post<RegProcessResponseData>(
        BackendURL + 'processreg',
        { ConfirmationTrxID: confirmationTrxID, FirstName : firstName, LastName: lastName,
          UserID : userid, Password : password, EmailAddress: email, PreferredLanguageID : prefferedLang,
          UserMobileNo : mobileno}
      );
  }


}
