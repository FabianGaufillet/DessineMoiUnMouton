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
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);
  userService = inject(UserService);

  snackBarRef?: MatSnackBarRef<NotificationComponent>;
  durationInSeconds = 3;
  errorMessage = '';

  signUpFormBuilder = new FormBuilder().nonNullable;

  signUpForm = this.signUpFormBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ),
      ],
    ],
  });

  async onSubmit() {
    if (this.signUpForm.valid) {
      try {
        const response: any = await this.authService.signup({
          last_name: this.signUpForm.controls.lastName.value,
          first_name: this.signUpForm.controls.firstName.value,
          email: this.signUpForm.controls.email.value,
          password: this.signUpForm.controls.password.value,
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

  get firstName() {
    return this.signUpForm.get('firstName');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }
}
