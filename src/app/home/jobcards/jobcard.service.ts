import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JobCard } from './jobcard.model';
import { UserPreferredFilter } from './userpreferredfilter.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const BackendURL = environment.API_Prefix ;


@Injectable({
  providedIn: 'root'
})
export class JobcardService {

  constructor(private http: HttpClient ) { }

  private usrFltr = new BehaviorSubject<UserPreferredFilter>(null);

  setPreferredFilterOption(flr: string){

    const userLang = new UserPreferredFilter(
      flr
    );

    this.usrFltr.next(userLang);

  }


  get PreferredFilterOption() {
    return this.usrFltr.asObservable().pipe(
      map(fr => {
        if (fr) {
          return fr.fltr;
        } else {
          return '1';
        }
      })
    );
  }

  GetJobCards(userToken: string, status: string, page: number) {
    return this.http
      .get<JobCard[]>(
        BackendURL + 'getjobcardlist/' + userToken + '/' + status + '/' + page,
      );
  }

  GetJobCardsByStatusJobCard(userToken: string, status: string, jobcardNo: string) {
    return this.http
      .get<JobCard[]>(
        BackendURL + 'getjobcardsbycardno/' + userToken + '/' + status + '/' + jobcardNo,
      );
  }


  GetJobCardsByStatusPlateNo(userToken: string, status: string, plateNo: string) {
    return this.http
      .get<JobCard[]>(
        BackendURL + 'getjobcardsbyplateno/' + userToken + '/' + status + '/' + plateNo,
      );
  }


  GetJobCardsViaSearchFilters(userToken: string, status: string, fromdt: string, todt: string, page: number) {
    return this.http
      .get<JobCard[]>(
        BackendURL + 'getjobcardlist/' + userToken + '/' + status + '/' + fromdt + '/' + todt + '/' +  page,
      );
  }

  GetJobCard(userToken: string, workOrderid: string, equipmentID: string) {
    return this.http
      .get<JobCard>(
        BackendURL + 'jobcard/' + userToken + '/' + workOrderid + '/' + equipmentID,
      );
  }


}
