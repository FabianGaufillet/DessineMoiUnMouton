import { Component, effect, inject } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-tabs',
  standalone: true,
  imports: [MatTabGroup, MatTab, SignUpComponent, SignInComponent],
  templateUrl: './login-tabs.component.html',
  styleUrl: './login-tabs.component.scss',
})
export class LoginTabsComponent {
  authService = inject(AuthService);
  userConnected = false;

  constructor() {
    effect(() => {
      this.userConnected = this.authService.isLoggedIn();
    });
  }
}
