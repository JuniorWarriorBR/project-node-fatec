import { Injectable, Injector, Inject } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { LoginService } from './login.service';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector, private loginService: LoginService) {}

  intercept(req, next) {
    const loginService = this.injector.get(LoginService);
    const tokenizedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        Authorization: `Bearer ${loginService.getToken()}`,
      },
    });
    // return next.handle(tokenizedReq);

    return next.handle(tokenizedReq).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.loginService.logout();
          }
        }
      )
    );
  }
}
