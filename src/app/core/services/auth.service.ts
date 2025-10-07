import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {environment} from '../../../environments/environment';
import {User, UserHttp} from '../../entities/user.entity';

interface CustomJwtPayload extends JwtPayload {
    sub: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthdate?: number;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    public currentUser: Observable<User | null>;
    private readonly currentUserSubject: BehaviorSubject<User | null>;
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    constructor(private readonly http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
        this.currentUser = this.currentUserSubject.asObservable();
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    setToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    removeToken(): void {
        localStorage.removeItem('authToken');
        this.currentUserSubject.next(null);
    }

    login(credentials: any): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
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
            .pipe(catchError(this.handleError));
    }

    logout(): void {
        this.removeToken();
    }

    verifyEmail(email: string, code: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/verify`, {params: {email, code}})
            .pipe(catchError(this.handleError));
    }

    isAuthenticated(): Observable<boolean> {
        return this.currentUser.pipe(map(user => !!user));
    }

    isAuthenticatedSync(): boolean {
        return !!this.getToken();
    }

    private getUserFromToken(): User | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                this.removeToken();
                return null;
            }

            return {
                password: '', verificationCode: '',
                email: decoded.email,
                firstname: decoded.firstname,
                lastname: decoded.lastname,
                birthdate: decoded.birthdate
                    ? new Date(decoded.birthdate * 1000)
                    : new Date(0),
                isVerified: true,
                address: '',
                phone: decoded.phone
            };
        } catch (error) {
            console.error('Erreur lors du décodage du JWT:', error);
            this.removeToken();
            return null;
        }
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Erreur: ${error.error.message}`;
        } else {
            errorMessage = error.error?.message || `Erreur serveur (${error.status})`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
