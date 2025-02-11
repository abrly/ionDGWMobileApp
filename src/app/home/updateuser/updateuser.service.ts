import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserInformation } from './models/userinformation.model';


const BackendURL = environment.API_Prefix ;

export interface ResponseData {
  ResponseCode: string;
  ResponseDescription: string;
}


@Injectable({
  providedIn: 'root'
})
export class UpdateuserService {

  constructor(private http: HttpClient ) { }

  getUserInformation(userToken: string) {
    return this.http
      .get<UserInformation>(
        BackendURL + 'getuser' +  '/' + userToken,
      );
  }

  updateUserInformation(userID: string, firstName: string, lastName: string, emailAddress: string,
                        preferredLanguageID: number, updatedBy: string, loadedUserToken: string) {
    return this.http
      .post<ResponseData>(
        BackendURL + 'updateuser' + '/' + loadedUserToken ,
        { UserID : userID, FirstName: firstName, LastName : lastName, EmailAddress : emailAddress,
           PreferredLanguageID : preferredLanguageID, UpdatedBy: updatedBy}
      );
    }


}
