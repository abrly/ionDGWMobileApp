import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { WorkLog } from './worklog.model';
import { StatusLog } from './statuslog.model';

const BackendURL = environment.API_Prefix ;

@Injectable({
  providedIn: 'root'
})
export class WorklogService {

  constructor(private http: HttpClient ) { }

  GetWorkLogs(userToken: string, workOrderID: string, equipmentID: string) {
    return this.http
      .get<WorkLog[]>(
        BackendURL + 'worklog/' + userToken + '/' +  workOrderID + '/' + equipmentID
      );
  }

  GetWorkLogReportURL(userToken: string, workOrderID: string) {
    return this.http
      .get<string>(
        BackendURL + 'GetJobCardReportURL/' + userToken + '/' +  workOrderID 
      );
  }

  GetStatusLogs(userToken: string, workOrderID: string, equipmentID: string) {
    return this.http
      .get<StatusLog[]>(
        BackendURL + 'statuslog/' + userToken + '/' +  workOrderID + '/' + equipmentID
      );
  }

}
