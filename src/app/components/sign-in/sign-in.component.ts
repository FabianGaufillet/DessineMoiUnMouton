import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    NotificationComponent,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  signInFormBuilder = new FormBuilder().nonNullable;

  durationInSeconds = 3;
  errorMessage = '';

  signInForm = this.signInFormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onSubmit() {
    if (this.signInForm.valid) {
      try {
        const response: any = await this.authService.signin({
          email: this.signInForm.controls.email.value,
          password: this.signInForm.controls.password.value,
        });
        this.errorMessage = '';
        this.notify(response['message']);
      } catch (err: any) {
        this.errorMessage = err.message;
      }
    }
  }

  notify(message: string) {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: { message },
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }
}
