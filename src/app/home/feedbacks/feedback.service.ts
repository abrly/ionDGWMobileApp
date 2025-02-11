import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Feedback } from './feedback.model';
import { FeedbackType } from './feedbacktype.model';
import { ServiceType } from '../../home/servicetype.model';
import { AuthService } from 'src/app/auth/auth.service';

const BackendURL = environment.API_Prefix ;

export interface FeedbackResponse {
  ResponseCode: string;
  ResponseDescription: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient ) { }

  addFeedback(serviceTypeID: number, feedbackTypeID: number, feedbackMessage: string, attchment: any, createdBy: string) {
    return this.http
      .post<FeedbackResponse>(
        BackendURL + 'feedback/' + createdBy,
        {
          ServiceID : serviceTypeID, FeedbackTypeID : feedbackTypeID,
          FeedbackMessage : feedbackMessage, Attachment:
          attchment, CreatedBy : createdBy}
      );
  }


  getFeedBackTypes(userToken: string) {
    return this.http
      .get<FeedbackType[]>(
        BackendURL + 'feedbacktype/' + userToken,
      );
  }


  getServiceTypes(userToken: string) {
    return this.http
      .get<ServiceType[]>(
        BackendURL + 'service/' + userToken,
      );
  }


}
