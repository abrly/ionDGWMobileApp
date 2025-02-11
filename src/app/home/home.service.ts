import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message } from '../home/message.model';

const BackendURL = environment.API_Prefix;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient ) { }

  GetMessage(userToken: string) {
    return this.http
      .get<Message>(
        BackendURL + 'getusrmsg/' + userToken,
      );
  }


}
