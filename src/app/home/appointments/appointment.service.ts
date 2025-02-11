import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from './models/appointment.model';
import { AppointmentEvent } from './models/appointmentevent.model';
import { Timeslot } from './models/timeslot.model';

import { Platecode } from './models/platecode.model';
import { VehicleDetail } from './models/vehicledetail.model';
import { Service_Advisor } from './models/service_advisor.model';
import { AppointmentType } from './models/appointmenttype.model';

const BackendURL = environment.API_Prefix ;

export interface AppointmentResponse {
  ResponseCode: string;
  ResponseDescription: string;
}


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient ) { }

  private usr = new BehaviorSubject<AppointmentEvent>(null);

  GetAppointments(userToken: string,month: string ,year : string) {
    return this.http
      .get<Appointment[]>(
        BackendURL + 'getmyappointments/' + userToken  + '/' + month + '/' + year,
      );
  }


  GetAppointment(userToken: string,apmtID: string) {
    return this.http
      .get<Appointment[]>(
        BackendURL + 'getmyappointment/' + userToken  + '/' + apmtID,
      );
  }

  CancelAppointment(userToken: string,apmtID: string) {
    return this.http
      .get<AppointmentResponse>(
        BackendURL + 'cancelappointment/' + userToken  + '/' + apmtID,
      );
  }


  getPlateCodes(userToken: string) {
    return this.http
      .get<Platecode[]>(
        BackendURL + 'getplatecodes/' + userToken,
      );
  }


  getTimeslots(userToken: string,appointmentDate: string) {
    return this.http
      .get<Timeslot[]>(
        BackendURL + 'gettimeslots/' + userToken + '/' +  appointmentDate,
      );
  }


  getVehicleDetails(userToken: string,deptno: string,plateno:string, platecode:string) {

    console.log('did you come hr');

    return this.http
      .get<VehicleDetail>(
        BackendURL + 'getvehicleInfo/' + userToken + '/' +  deptno + '/' + plateno + '/' + platecode,
      );
  }


  addAppointment(userToken: string,apmt: Appointment) {  
    
    console.log(`full payload ${apmt.AppointmentDateTime}`);
    
    return this.http
      .post<AppointmentResponse>(
        BackendURL + 'addappointment/' + userToken,
        {
          AppointmentDateTime : apmt.AppointmentDateTime, 
          Timeslot:apmt.Timeslot,
          Title:apmt.Title,
          Description:apmt.Description,
          CustomerName:apmt.CustomerName,
          MobileNo:apmt.MobileNo,
          EmailAddress:apmt.EmailAddress,
          Address:apmt.Address,
          VehicleID:apmt.VehicleID,
          Platecode:apmt.PlateCode,
          PlateNo:apmt.PlateNo,
          Language:apmt.Language,
          VehicleDetail:apmt.VehicleDetail,
          VehicleColor:apmt.VehicleColor,
          ServiceAdvisorId:apmt.ServiceAdvisorId,
          MeterReading:apmt.MeterReading,
          AppointmentTypeId:apmt.AppointmentTypeId
         }
      );
  }


  getServiceAdvisors(userToken: string) {
    return this.http
      .get<Service_Advisor[]>(
        BackendURL + 'getserviceadvisors/' + userToken,
      );
  }


  
  getAppointmentTypes(userToken: string,langId: string) {
    return this.http
      .get<AppointmentType[]>(
        BackendURL + 'getappointmenttypes/' + userToken + '/' +  langId ,
      );
  }
 
  

}
