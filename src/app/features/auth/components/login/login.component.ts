import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm!: FormGroup;
    errorMessage: string | null = null;
    isLoading: boolean = false;

    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.errorMessage = null;
            this.isLoading = true;

            this.authService.login(this.loginForm.value).pipe(
                takeUntil(this.destroy$)
            ).subscribe({
                next: () => {
                    this.router.navigate(['/']).then(() => this);
                },
                error: (err: HttpErrorResponse) => {
                    this.isLoading = false;
                    if (err.error && typeof err.error === 'string') {
                        this.errorMessage = err.error;
                    } else if (err.error) {
                        this.errorMessage = err.error.message;
                    } else if (err.status === 401 || err.status === 403) {
                        this.errorMessage = "Email ou mot de passe invalide.";
                    } else {
                        this.errorMessage = "Une erreur inattendue est survenue.";
                    }
                    console.error('Erreur de connexion:', err);
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
