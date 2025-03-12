import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router : Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
          } else if(error.status === 403){
            errorMessage = "Accès refusé"
          }
        }
        console.error(errorMessage);
        return throwError(() => errorMessage);
      })
    );
  }
}
