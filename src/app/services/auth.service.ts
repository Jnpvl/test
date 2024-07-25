import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NEWUSER, USER } from '../interfaces/user.interface';
import { BASE_URL } from '../global';

interface LoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  email: string = '';
  isLoggedIn = false;
  verificationCode: boolean = false;

  authToken: any;

  constructor(private http: HttpClient) {}

  /* HTTP REQUEST METHODS */

  login(email: string, password: string) {
    return this.http.post<any>(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
  }

  register(user: NEWUSER) {
    return this.http.post<any>(`${BASE_URL}/auth/register`, user);
  }

  sendRecoveryCode(email:string){
    return this.http.post<any>(`${BASE_URL}/auth/recover-password`, { email });
  }
  
  resetPassword(email: string, newPassword: string) {
    return this.http.post<any>(`${BASE_URL}/auth/reset-password`, {
      email,
      newPassword,
    });
  }
  

  /* BUSINESS LOGIC */

  logout() {
    this.isLoggedIn = false;
    this.authToken = null;
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('external');
    window.localStorage.removeItem('verificationCode');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('openpayId');
  }

  setVerificationCode() {
    this.verificationCode = true;
    window.localStorage.setItem('verificationCode', 'true');
  }

  setFalseVerificationCode() {
    this.verificationCode = false;
    window.localStorage.setItem('verificationCode', 'false');
  }

  getVerificationCode() {
    this.verificationCode = JSON.parse(
      window.localStorage.getItem('verificationCode') || 'false'
    );
    return this.verificationCode;
  }

  /* TOKEN HANDLER */

  setToken(token: string) {
    this.authToken = token;
    window.localStorage.setItem('token', this.authToken);
  }

  getToken() {
    return window.localStorage.getItem('token');
  }

  getEmail() {
    this.email = window.localStorage.getItem('email') || '';
    return this.email;
  }
 
  confirmRecoveryCode(email: string,code: string){
    let emailSend = email
    return this.http.post<any>(`${BASE_URL}/auth/validate-otp`, {
      code,
      email: emailSend,
    });
  }

  
  confirmRegisterCode(code: string) {
    let emailSend = this.getEmail();
    return this.http.post<any>(`${BASE_URL}/auth/activate`, {
      code,
      email: emailSend,
    });
  }
}
