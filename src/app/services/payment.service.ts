import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BASE_URL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  token: string = '';
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  generateCharge(data: any) {
    const token = this.auth.getToken();
    this.token = token ?? '';
    const header = { Authorization: `Bearer ${this.token}` };
    if(!this.token) {
      throw new Error('Token is required to generate a new Charge.');
    }
    if (!data) {
      throw new Error('Data is required to generate a new Charge.');
    }
    return this.http.post<any>(`${BASE_URL}/payments/create`, {data}, {
      headers: header
    })
  }
}
