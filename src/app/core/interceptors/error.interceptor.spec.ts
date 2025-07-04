import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ErrorInterceptor} from './error.interceptor';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: Router, useValue: routerSpy},
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 401 errors', () => {
    const mockError = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    httpClient.get('/api/data').subscribe({
      next: () => fail('should have failed with the 401 error'),
      error: (error) => {
        expect(error).toBeDefined();
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      }
    });

    const req = httpMock.expectOne('/api/data');
    req.flush(null, mockError);

  });

  it('should handle other errors', () => {
    const mockError = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    httpClient.get('/api/data').subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error) => {
        expect(error).toBeDefined();
        expect(authServiceSpy.logout).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne('/api/data');
    req.flush(null, mockError);
  });

  it('should handle client-side errors', () => {
    const mockError = new ErrorEvent('Network error', {
      message: 'Client-side error',
    });

    httpClient.get('/api/data').subscribe({
      next: () => fail('should have failed with client side error'),
      error: (error) => {
        expect(error).toBeDefined();
        expect(error).toContain('Client-side error');

      }
    });

    const req = httpMock.expectOne('/api/data');
    req.error(mockError);
  });
});
