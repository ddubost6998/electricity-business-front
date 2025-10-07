import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {CustomValidators} from '../../../../shared/validators/custom-validators';
import {UserHttp} from "../../../../entities/user.entity";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;
    errorMessage: string | null = null;
    loading = false;

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    // Getter simplifie l'accès aux contrôles
    get f() {
        return this.registerForm.controls;
    }

    get addressForm() {
        return this.registerForm.get('address') as FormGroup;
    }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            firstname: ['', [Validators.required, Validators.maxLength(50)]],
            lastname: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
            phone: ['', [Validators.required, Validators.pattern(/^0[1-9](\d{2}){4}$/)]],
            password: ['', [Validators.required, this.passwordStrengthValidator()]],
            confirmPassword: ['', [Validators.required]],
            birthdate: ['', [Validators.required]],
            address: this.fb.group({
                street: ['', [Validators.required, Validators.maxLength(255)]],
                city: ['', [Validators.required, Validators.maxLength(100)]],
                zipcode: ['', [Validators.required, Validators.maxLength(10)]],
            }),
        }, {
            validators: [CustomValidators.match('password', 'confirmPassword')]
        });
    }

    passwordStrengthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            const hasMinLength = value.length >= 12;
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumeric = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(value);

            const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

            return isValid ? null : {
                passwordStrength: {hasMinLength, hasUpperCase, hasLowerCase, hasNumeric, hasSpecialChar}
            };
        };
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.loading = true;
            const formValue = this.registerForm.value;

            const user: UserHttp = {
                firstname: formValue.firstname,
                lastname: formValue.lastname,
                email: formValue.email,
                phone: formValue.phone,
                password: formValue.password,
                birthdate: new Date(formValue.birthdate),
                verificationCode: '', // gérer côté serveur
                isVerified: false,
                address:
                    `${formValue.address.street},
                    ${formValue.address.zipcode}
                    ${formValue.address.city}`,
            };

            this.errorMessage = null;
            this.authService.register(user).subscribe({
                next: (response) => {
                    console.log('Registration successful:', response.message);
                    this.router.navigate(['/auth/login']);
                },
                error: (err) => {
                    this.loading = false;
                    if (err.error?.message) this.errorMessage = err.error.message;
                    else if (err.message) this.errorMessage = err.message;
                    else this.errorMessage = 'Une erreur inattendue est survenue.';
                },
                complete: () => this.loading = false
            });
        } else {
            this.registerForm.markAllAsTouched();
            this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
        }
    }
}
