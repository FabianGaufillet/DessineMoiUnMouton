import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Credentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  private apiUrl: string = 'http://localhost:3000/api/user/signin';
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  signin(credentials: Credentials) {
    return this.http.post(this.apiUrl, credentials, { withCredentials: true });
  }
}
