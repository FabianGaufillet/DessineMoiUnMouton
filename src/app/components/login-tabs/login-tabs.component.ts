import { Component, effect, inject, ViewChild } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AuthService } from '../../services/auth.service';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-login-tabs',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    SignUpComponent,
    SignInComponent,
    GameComponent,
  ],
  templateUrl: './login-tabs.component.html',
  styleUrl: './login-tabs.component.scss',
})
export class LoginTabsComponent {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  authService = inject(AuthService);
  userConnected = false;

  constructor() {
    effect(() => {
      this.userConnected = this.authService.isLoggedIn();
      if (this.userConnected) this.tabGroup.selectedIndex = 3;
    });
  }
}
