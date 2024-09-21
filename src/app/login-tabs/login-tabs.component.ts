import { Component } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-login-tabs',
  standalone: true,
  imports: [MatTabGroup, MatTab, SignUpComponent, SignInComponent],
  templateUrl: './login-tabs.component.html',
  styleUrl: './login-tabs.component.scss',
})
export class LoginTabsComponent {}
