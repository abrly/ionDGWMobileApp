import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LanguageData } from './models/languagedata.model';

const BackendURL = environment.API_Prefix ;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient ) { }

  getLanguages() {
    return this.http
      .get<LanguageData[]>(
        BackendURL + 'getLanguages',
      );
   }


   

}
