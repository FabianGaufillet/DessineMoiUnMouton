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
import { take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignUpService } from '../sign-up.service';
import { NotificationComponent } from '../notification/notification.component';

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
  signUpService = inject(SignUpService);

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

  onSubmit() {
    if (this.signUpForm.valid) {
      this.signUpService
        .signup({
          last_name: this.signUpForm.controls.lastName.value,
          first_name: this.signUpForm.controls.firstName.value,
          email: this.signUpForm.controls.email.value,
          password: this.signUpForm.controls.password.value,
        })
        .pipe(take(1))
        .subscribe({
          next: (result: any) => {
            this.errorMessage = '';
            this.notify(result['message']);
          },
          error: (result) => (this.errorMessage = result['error']['message']),
          complete: () => {},
        });
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
