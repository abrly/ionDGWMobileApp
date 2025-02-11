import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { VehicleInformation } from './vehicleInformation.model';


const BackendURL = environment.API_Prefix ;

@Injectable({
  providedIn: 'root'
})
export class VehicleinfoService {

  constructor(private http: HttpClient ) { }

  GetVehicleInfoByPlateNo(userToken: string,plateNo: string) {
    return this.http
      .get<VehicleInformation>(
        BackendURL + 'getvehicleinfo/' + userToken + '/'  + plateNo,
      );
  }


}
