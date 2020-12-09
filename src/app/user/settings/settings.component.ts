import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { rePasswordMatchFactory } from 'src/app/shared/validators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  private _image: File | null = null;

  public usernameForm: FormGroup;
  public emailForm: FormGroup;
  public passwordForm: FormGroup;

  public currentUser$ = this.auth.currentUser$;
  public imagePreview: string | ArrayBuffer | null = null;

  public get isInPreview() {
    return this._image !== null;
  }

  public get usernameControl() {
    return this.usernameForm.get('username');
  }

  public get emailControl() {
    return this.emailForm.get('email');
  }

  public get passwordControl() {
    return this.passwordForm.get('password');
  }

  public get rePasswordControl() {
    return this.passwordForm.get('rePassword');
  }

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.usernameForm = fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.emailForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    const passwordControl = this.fb.control('', [
      Validators.required,
      Validators.minLength(6),
    ]);

    this.passwordForm = fb.group({
      password: passwordControl,
      rePassword: [
        '',
        [Validators.required, rePasswordMatchFactory(passwordControl)],
      ],
    });
  }

  changeUsernameHandler() {
    const { username } = this.usernameForm.value;

    this.auth.changeUsername(username).subscribe({
      next: () => {
        this.cancel(this.usernameForm);
      },
    });
  }

  changeEmailHandler() {
    const { email } = this.emailForm.value;

    this.auth.changeEmail(email).subscribe({
      next: () => {
        this.cancel(this.emailForm);
      },
    });
  }

  changePasswordHandler() {
    const { password } = this.passwordForm.value;

    this.auth.changePassword(password).subscribe({
      next: () => {
        this.cancel(this.passwordForm);
      },
    });
  }

  cancel(fg: FormGroup) {
    fg.reset();
  }

  imagePreviewHandler(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);

    if (file === undefined) {
      return;
    } else if (
      file === null ||
      !/.+\.(png|jpg|jpeg)/.test(file.name.toLocaleLowerCase())
    ) {
      console.error('Invalid image!');
      return;
    }

    this._image = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (reader.result !== null) {
        this.imagePreview = reader.result;
      }
    };
  }

  imageUploadHandler() {
    if (this._image === null) {
      return;
    }

    this.auth.changeProfilePicture(this._image)?.subscribe({
      next: () => {
        this._image = null;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  cancelPreviewHandler() {
    this._image = null;
    this.imagePreview = null;
  }
}
