import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // array in local storage for registered users
    const users: any[] = JSON.parse(localStorage.getItem('users')) || [];

    const token =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjNmZhNmY1OTUwYTdjZTQ2NWZjZjI0N2FhMGIwOTQ4MjhhYzk1MmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjIxMDI4MzMzNTQwLWRqbXNtMW5xZ25yNDZmanNsMmM4dDVzMXU1Yjg4cDIyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjIxMDI4MzMzNTQwLWRqbXNtMW5xZ25yNDZmanNsMmM4dDVzMXU1Yjg4cDIyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAzNDQ1OTQ1NjgzMzQ4NzUwMjEzIiwiaGQiOiJtZWRpYWFnaWxpdHkuY29tIiwiZW1haWwiOiJqb3N1ZS5zYW5kb3ZhbEBtZWRpYWFnaWxpdHkuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJUZ0pVTnRKU0V6bW1FUkJWVGlaSGRBIiwibmFtZSI6Ikpvc3XDqSBTYW5kb3ZhbCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHalNfYVBPQmY1d095VjBlTDBVdThmUmZyaHQ4VGQtRkU5bFBBMWt1dz1zOTYtYyIsImdpdmVuX25hbWUiOiJKb3N1w6kiLCJmYW1pbHlfbmFtZSI6IlNhbmRvdmFsIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MDE0MDg2NzYsImV4cCI6MTYwMTQxMjI3NiwianRpIjoiMzIyNTkwMTViZWZlNmUwNDFkZWUxMzBhY2Q2ZDBlNWUyMTY1NmJhZCJ9.HQZazAGsCiep2O2FL_GKpvh-Wl3uPoS2Y3eFSfaKN6-shCk4EPBQ02bA1Kj5MqvJzqsYeKakRZjNH85tK7oBlxbh0_BKdxcvhjxzjvorwNTJdZiCrY3tYfJoYN6SHsdjsqn2e0hve0g2jCpG8nG6oAwSzdR8W6eLQMKoFnrXk1sEe5felIN_67-bfOcV5slmplB4D6zkVRv9KbmiEdo6iXQA1Vh7hRvImYGLdwxpHsFwqlHS49KZUhURA83roc6RIrDvifVNEbKivWsICe-6zrSzTR7YkfAR_itNiGVdZOVMAViCuqX0DxawmenDaFL3hnQlmVwX9rexrgPzZ24kiA';

    // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpvc3VlIFNhbmRvdmFsIiwiYWRtaW4iOnRydWV9.4EEShn8pCxb0Pl_PnZQaN_MAc9j9XW6HDXC3YjoqDaY';

    // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpvc3VlIFNhbmRvdmFsIiwiYWRtaW4iOmZhbHNlfQ.vWBAx1YLX-l64Ial8bTAFay5YlsanqFUWRQFMkqalbg';
    // wrap in delayed observable to simulate server api call
    return (
      of(null)
        .pipe(
          mergeMap(() => {
            // authenticate
            if (
              request.url.endsWith('/api/authenticate') &&
              request.method === 'POST'
            ) {
              // find if any user matches login credentials
              const body = request.body;

              if (
                body.email === 'admin@domain.com' &&
                body.password === '1234'
              ) {
                return of(new HttpResponse({ status: 200, body: { token } }));
              } else {
                return throwError({
                  error: { message: 'Username or password is incorrect' },
                });
              }
            }

            // get orders
            if (
              request.url.endsWith('/api/orders') &&
              request.method === 'GET'
            ) {
              // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
              if (request.headers.get('Authorization') === 'Bearer ' + token) {
                return of(new HttpResponse({ status: 200, body: [1, 2, 3] }));
              } else {
                // return 401 not authorised if token is null or invalid
                return throwError({ error: { message: 'Unauthorised' } });
              }
            }

            // pass through any requests not handled above
            return next.handle(request);
          })
        )

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize())
    );
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
