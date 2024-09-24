import {
  AfterViewInit,
  Component,
  effect,
  inject,
  ViewChild,
} from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AuthService } from '../../services/auth.service';
import { GameComponent } from '../game/game.component';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';

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
export class LoginTabsComponent implements AfterViewInit {
  cookieService: CookieService = inject(CookieService);
  userService = inject(UserService);
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  authService = inject(AuthService);
  userConnected = false;

  constructor() {
    if (this.cookieService.check('DMUM-authenticated')) {
      this.reconnect();
    }
    effect(() => {
      this.userConnected = this.authService.isLoggedIn();
      if (this.userConnected) this.tabGroup.selectedIndex = 3;
    });
  }

  ngAfterViewInit() {
    if (this.userConnected) {
      this.tabGroup.selectedIndex = 3;
    }
  }

  async reconnect() {
    try {
      const response: any = await this.authService.reconnect();
      this.userService.user = {
        _id: response.data['_id'],
        first_name: response.data['first_name'],
        last_name: response.data['last_name'],
        email: response.data['email'],
      };
      this.authService.isLoggedIn.set(true);
    } catch (err: any) {
      console.error(err);
    }
  }
}
