import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AuthService } from '../../services/auth.service';
import { GameComponent } from '../game/game.component';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
import { LeaderboardComponent } from '../../leaderboard/leaderboard.component';

@Component({
  selector: 'app-login-tabs',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    SignUpComponent,
    SignInComponent,
    GameComponent,
    LeaderboardComponent,
  ],
  templateUrl: './login-tabs.component.html',
  styleUrl: './login-tabs.component.scss',
})
export class LoginTabsComponent implements OnInit, AfterViewInit {
  cookieService: CookieService = inject(CookieService);
  userService = inject(UserService);
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  authService = inject(AuthService);
  userConnected = false;
  data = [];

  constructor() {
    effect(() => {
      this.userConnected = this.authService.isLoggedIn();
      if (this.userConnected) this.tabGroup.selectedIndex = 3;
    });
  }

  ngOnInit() {
    if (this.cookieService.check('DMUM-authenticated')) {
      this.reconnect();
    }
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

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 4) this.leaderboard();
  }

  async leaderboard() {
    try {
      const response: any = await this.userService.leaderboard();
      this.data = response.data.map((el: any) => {
        return {
          first_name: el.first_name,
          last_name: el.last_name,
          points: el.points,
          playing_time: el.playing_time,
        };
      });
    } catch (err) {
      console.error(err);
    }
  }
}
