import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {CustomValidators} from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  get f() {
    return this.registerForm.controls;
  }

  get addressForm() {
    return this.registerForm.controls['address'] as FormGroup;
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

      if (!value) {
        return null;
      }

      const hasMinLength = value.length >= 12;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value);

      const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

      if (!isValid) {
        return {
          passwordStrength: {
            hasMinLength: hasMinLength,
            hasUpperCase: hasUpperCase,
            hasLowerCase: hasLowerCase,
            hasNumeric: hasNumeric,
            hasSpecialChar: hasSpecialChar
          }
        };
      }

      return null;
    };
  }


  onSubmit(): void {
    if (this.registerForm.valid) {
      const user = {
        ...this.registerForm.value,
        address: {
          ...this.registerForm.value.address
        }
      }
      this.errorMessage = null;
      this.authService.register(user).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response.message);
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
    }
  }
}
