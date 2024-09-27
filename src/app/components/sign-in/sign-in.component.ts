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
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { take } from 'rxjs';

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
  userService = inject(UserService);
  signInFormBuilder = new FormBuilder().nonNullable;

  snackBarRef?: MatSnackBarRef<NotificationComponent>;
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
        this.userService.user = {
          _id: response.data['_id'],
          first_name: response.data['first_name'],
          last_name: response.data['last_name'],
          email: response.data['email'],
        };
        this.errorMessage = '';
        this.notify(response['message']);
      } catch (err: any) {
        this.errorMessage = err.message;
      }
    }
  }

  notify(message: string) {
    this.snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
      data: { message },
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });

    this.snackBarRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe(() => {
        this.snackBar
          .open('Vous êtes connecté(e)', 'Se déconnecter')
          .afterDismissed()
          .pipe(take(1))
          .subscribe(async () => {
            await this.authService.logout();
          });
      });
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }
}
