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
import { SignInService } from '../sign-in.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
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
  signInService = inject(SignInService);
  signInFormBuilder = new FormBuilder().nonNullable;

  durationInSeconds = 3;
  errorMessage = '';

  signInForm = this.signInFormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.signInForm.valid) {
      this.signInService
        .signin({
          email: this.signInForm.controls.email.value,
          password: this.signInForm.controls.password.value,
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

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }
}
