import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { rePasswordMatchFactory } from 'src/app/shared/validators';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;
  isLoading: boolean = false;

  get emailInput(): AbstractControl | null {
    return this.form.get('email');
  }

  get passwordInput(): AbstractControl | null {
    return this.form.get('password');
  }

  get rePasswordInput(): AbstractControl | null {
    return this.form.get('rePassword');
  }

  constructor(
    private fb: FormBuilder,
    private authService: UserService,
    private router: Router
  ) {
    const passwordControl = this.fb.control('', [
      Validators.required,
      Validators.minLength(6),
    ]);

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: passwordControl,
      rePassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          rePasswordMatchFactory(passwordControl),
        ],
      ],
    });
  }

  submitHandler() {
    this.isLoading = true;

    const { email, password } = this.form.value;

    this.authService.register(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }
}
