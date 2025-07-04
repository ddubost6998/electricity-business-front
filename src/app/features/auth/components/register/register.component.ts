import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
    return this.registerForm.controls['address'] as FormGroup
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^0[1-9](\d{2}){4}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required, Validators.maxLength(255)]],
        city: ['', [Validators.required, Validators.maxLength(100)]],
        zipcode: ['', [Validators.required, Validators.maxLength(10)]],
      })
    }, {
      validators: [CustomValidators.match('password', 'confirmPassword')]
    });
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
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
    }
  }
}
