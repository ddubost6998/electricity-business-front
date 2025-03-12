import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, UserHttp } from '../../entities/user.entity';
import { jwtDecode, JwtPayload } from "jwt-decode";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
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
          birthdate: new Date(decodedToken.birthdate),
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
  isAuthenticated(): Observable<boolean> {
    return this.currentUser.pipe(map(user => !!user));
  }

  getToken(): string | null {
    return this.getCookie('authToken');
  }

  setToken(token: string, rememberMe: boolean = false): void {
    const decodedToken: JwtPayload = jwtDecode(token);

    const expires = decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 3600 * 1000); // Default 1 hour

    document.cookie = `authToken=${token}; expires=${expires.toUTCString()}; path=/; Secure; HttpOnly`;
  }

  removeToken(): void {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; HttpOnly';
    this.currentUserSubject.next(null);
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

  register(user: UserHttp): Observable<User> {
    return this.http.post<UserHttp>(`${this.apiUrl}/register`, user)
      .pipe(
        map(User.fromHttp),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  verifyEmail(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { code }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
      if (error.status === 400) {
        errorMessage = "Requête incorrecte. Veuillez vérifier les données saisies.";
      } else if (error.status === 401) {
        errorMessage = "Identifiants incorrects.";
      } else if (error.status === 403) {
        errorMessage = "Accès refusé.";
      } else if (error.status === 409){
        errorMessage = "L'utilisateur existe déja."
      }
      else if (error.status === 500) {
        errorMessage = "Erreur interne du serveur.";
      }
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
