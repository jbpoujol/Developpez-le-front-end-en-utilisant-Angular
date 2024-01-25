import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NetworkService } from '../services/network.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  constructor(private networkService: NetworkService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!navigator.onLine) {
      // L'utilisateur est hors ligne
      return throwError(
        new HttpErrorResponse({ error: 'Internet is required for this action' })
      );
    }

    return next.handle(req).pipe(
      catchError((err) => {
        // TODO : Gestion des erreurs HTTP
        return throwError(err);
      })
    );
  }
}
