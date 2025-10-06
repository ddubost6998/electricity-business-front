import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Récupère le token depuis le localStorage ou le sessionStorage
        const token = this.authService.getToken();

        // Clone la requête et ajoute le header Authorization si le token existe
        const authReq = token ? request.clone({
            setHeaders: {Authorization: `Bearer ${token}`}
        }) : request;

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    // Token invalide ou expiré donc déconnexion et redirection
                    this.authService.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}
