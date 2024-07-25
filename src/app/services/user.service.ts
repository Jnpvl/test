import { Injectable } from '@angular/core';
import { USER } from '../interfaces/user.interface';
import { BASE_URL } from '../global';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: USER | null = null;
  token: string | null = null;
  email: string | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.getUser();
    this.token = this.auth.getToken() || window.localStorage.getItem('token');
    this.email = this.auth.getEmail() || window.localStorage.getItem('email');
  }

  updateProfile(id: number, data: any) {
    this.token = this.auth.getToken();
    return this.http.put<any>(`${BASE_URL}/users/${id}/update`, data, {
      headers: { Authorization: `Bearer ${this.token}` },
    }).pipe(
      tap((response: any) => {
        if(response.user){
          this.setUser(response.user);
        }
      })
    );
  }

  setEmail(email: string) {
    window.localStorage.setItem('email', email);
    this.email = email;
  }

  getEmail() {
    return this.email;
  }

  setUser(user: USER) {
    this.user = user;
    window.localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): USER | null {
    const userData = window.localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    return this.user;
  }
}
