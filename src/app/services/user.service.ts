import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  #user: User | null = null;

  constructor() {}

  get user(): User | null {
    return this.#user;
  }

  set user(user: User) {
    this.#user = user;
  }

  async leaderboard() {
    try {
      return await firstValueFrom(this.http.get(`${this.apiUrl}/`));
    } catch (err: any) {
      return Promise.reject(new Error(err.error.message));
    }
  }
}
