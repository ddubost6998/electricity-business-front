import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {User, UserHttp} from '../../entities/user.entity';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser: Observable<User | null>;
  private currentUserSubject: BehaviorSubject<User | null>;
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser.pipe(map(user => !!user));
  }

  getToken(): string | null {
    return this.getCookie('authToken');
  }

  setToken(token: string, rememberMe: boolean = false): void {
    const decodedToken: JwtPayload = jwtDecode(token);

    const expires = decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 3600 * 1000);

    document.cookie = `authToken=${token}; expires=${expires.toUTCString()}; path=/; Secure; HttpOnly`;
  }

  removeToken(): void {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; HttpOnly';
    this.currentUserSubject.next(null);
  }

  login(credentials: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          const user = this.getUserFromToken();
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  register(user: UserHttp): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ProgressEvent && error.status >= 200 && error.status < 300) {
            console.warn('Register successful but response parsing failed. Assuming success:', error);
            return of({message: "Inscription réussie (réponse du serveur inattendue)"});
          }
          return this.handleError(error);
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  verifyEmail(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, {code}).pipe(
      catchError(this.handleError)
    );
  }

  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        const user: User = {
          id: decodedToken.sub,
          email: decodedToken.email,
          firstname: decodedToken.firstname,
          lastname: decodedToken.lastname,
          birthdate: new Date(decodedToken.birthdate * 1000),
          isVerified: true,
          address: decodedToken.address,
          phone: decodedToken.phone
        };

        return user;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
      if (error.status === 400) {
        errorMessage = error.error?.message || "Requête incorrecte. Veuillez vérifier les données saisies.";
      } else if (error.status === 401) {
        errorMessage = error.error?.message || "Identifiants incorrects.";
      } else if (error.status === 403) {
        errorMessage = error.error?.message || "Accès refusé.";
      } else if (error.status === 409) {
        errorMessage = error.error?.message || "L'utilisateur existe déjà.";
      } else if (error.status === 500) {
        errorMessage = error.error?.message || "Erreur interne du serveur.";
      } else {
        errorMessage = error.error?.message || `Erreur inattendue (${error.status})`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
