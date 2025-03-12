import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {User, UserHttp} from '../../entities/user.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromToken(): {
    id: any;
    email: any;
    firstname: any;
    lastname: any;
    birthdate: Date;
    isVerified: boolean;
    address: any;
    phone: any;
    password: string;
    verificationCode: string
  } | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = token;
        return {
          id: decodedToken.sub,
          email: decodedToken.email,
          firstname: decodedToken.firstname,
          lastname: decodedToken.lastname,
          birthdate: new Date(decodedToken.birthdate),
          isVerified: true,
          address: decodedToken.address,
          phone: decodedToken.phone,
          password: '',
          verificationCode: ''
        };
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

  removeToken(): void {
    document.cookie =
      'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; HttpOnly';
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

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            const user = this.getUserFromToken();
            // @ts-ignore
            this.currentUserSubject.next(user);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(user: UserHttp): Observable<User> {
    return this.http.post<UserHttp>(`${this.apiUrl}/register`, user)
      .pipe(
        map(User.fromHttp),
        tap( registeredUser => {
        }),
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
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(
      () => 'Something bad happened; please try again later.'
    );
  }
}
