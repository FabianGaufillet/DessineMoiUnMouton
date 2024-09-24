import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  last_name: string;
  first_name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = 'http://localhost:3000/api/user';
  private http: HttpClient = inject(HttpClient);

  isLoggedIn = signal<boolean>(false);

  constructor() {}

  async signin(credentials: SignInCredentials) {
    try {
      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/signin`, credentials, {
          withCredentials: true,
        }),
      );
      this.isLoggedIn.set(true);
      return response;
    } catch (err: any) {
      this.isLoggedIn.set(false);
      return Promise.reject(new Error(err.error.message));
    }
  }

  async signup(credentials: SignUpCredentials) {
    try {
      return await firstValueFrom(
        this.http.post(`${this.apiUrl}/signup`, credentials, {
          withCredentials: true,
        }),
      );
    } catch (err: any) {
      return Promise.reject(new Error(err.error.message));
    }
  }

  async reconnect() {
    try {
      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/reconnect`, '', {
          withCredentials: true,
        }),
      );
      this.isLoggedIn.set(true);
      return response;
    } catch (err: any) {
      this.isLoggedIn.set(false);
      return Promise.reject(new Error(err.error.message));
    }
  }
}
