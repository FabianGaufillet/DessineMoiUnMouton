import { Component } from '@angular/core';
import { LoginTabsComponent } from './login-tabs/login-tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginTabsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
