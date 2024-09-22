import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Credentials {
  last_name: string;
  first_name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiUrl: string = 'http://localhost:3000/api/user/signup';
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  signup(credentials: Credentials) {
    return this.http.post(this.apiUrl, credentials, { withCredentials: true });
  }
}
