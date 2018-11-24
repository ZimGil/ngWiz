import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EmptyResponseBodyErrorInterceptor implements HttpInterceptor {

  constructor(private route: ActivatedRoute, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status >= 200 && err.status < 300) {
            const res = new HttpResponse({
              body: null,
              headers: err.headers,
              status: err.status,
              statusText: err.statusText,
              url: err.url
            });

            return of(res);
          }
          return throwError(err);
        })
      );
  }
}
