import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  private apiUrl: string = 'http://localhost:3000/api/user';
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
      return await firstValueFrom(
        this.http.post(`${this.apiUrl}/`, '', {
          withCredentials: true,
        }),
      );
    } catch (err: any) {
      return Promise.reject(new Error(err.error.message));
    }
  }
}
