import { Injectable } from '@angular/core';

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
  #user: User | null = null;

  constructor() {}

  get user(): User | null {
    return this.#user;
  }

  set user(user: User) {
    this.#user = user;
  }
}
