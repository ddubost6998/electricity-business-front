import {Component, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  form: FormGroup
  errorMsg?: string
  requestOnGoing: boolean = false

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  async onSubmitLogin(): Promise<void> {
    if (this.form.invalid || this.requestOnGoing) return

    const {email} = this.form.value
    this.errorMsg = undefined
    this.requestOnGoing = true

    try {
      await this.authService.login(email)
      this.router.navigateByUrl('/produits')
    } catch (e: any) {
      if (e.status === 401) this.errorMsg = 'Email ou mot de passe incorrect.'
      else this.errorMsg = 'Une erreur est survenue. Veuillez réessayer plus tard.'
    }

    this.requestOnGoing = false
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      remember: new FormControl(false)
    })
  }

}
