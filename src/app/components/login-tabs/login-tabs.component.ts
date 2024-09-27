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
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';

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
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  userConnected = false;
  data = [];

  constructor() {
    effect(() => {
      this.userConnected = this.authService.isLoggedIn();
      if (this.userConnected) this.tabGroup.selectedIndex = 3;
      else this.tabGroup.selectedIndex = 0;
    });
  }

  async ngOnInit() {
    if (this.cookieService.check('DMUM-authenticated')) {
      try {
        await this.reconnect();
        this.snackBar
          .open('Vous êtes connecté(e)', 'Se déconnecter')
          .afterDismissed()
          .pipe(take(1))
          .subscribe(async () => {
            await this.authService.logout();
          });
      } catch (err) {
        console.error(err);
      }
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
