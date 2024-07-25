import { Injectable } from '@angular/core';
import { BASE_URL } from '../global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentEmailService {

  constructor(
    private http: HttpClient,
  ) { }

  sendEmail(savedCharge: any) {
    const data = {
      savedCharge
    };
    
    return this.http.post<any>(`${BASE_URL}/payments/paymentReceipt`, data);
  }
}
