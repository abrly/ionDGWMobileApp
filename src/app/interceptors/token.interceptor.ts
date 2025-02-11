import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
        intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiToken = environment.API_Token;
        if (apiToken) {
            const headers = {
                Authorization: `Bearer ${apiToken}`,
            };
            if (request.responseType === 'json') {
                headers['Content-Type'] = 'application/json';
            }
            request = request.clone({
                setHeaders: headers
            });
        }

        return next.handle(request);
    }
}