import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { rePasswordMatchFactory } from 'src/app/shared/validators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  get emailInput(): AbstractControl | null {
    return this.form.get('email');
  }

  get usernameInput(): AbstractControl | null {
    return this.form.get('username');
  }

  get passwordInput(): AbstractControl | null {
    return this.form.get('password');
  }

  get rePasswordInput(): AbstractControl | null {
    return this.form.get('rePassword');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const passwordControl = this.fb.control('', [
      Validators.required,
      Validators.minLength(6),
    ]);

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: passwordControl,
      rePassword: [
        '',
        [Validators.required, rePasswordMatchFactory(passwordControl)],
      ],
    });
  }

  submitHandler() {
    this.isLoading = true;

    const { email, username, password } = this.form.value;

    this.authService.register$(email, username, password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      },
    });
  }
}
