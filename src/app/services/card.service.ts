import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../global';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { BehaviorSubject, from, Observable, switchMap, tap } from 'rxjs';
import { Card } from '../interfaces/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsSubject: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);
  cards: Observable<Card[]> = this.cardsSubject.asObservable();
  token: string = '';
  customerId: string = '';
  constructor(
    private http: HttpClient, 
    private auth: AuthService, 
    private user: UserService
  ) { }

  registerOpenpayUser() {
    const user = this.user.getUser();
    const emailSend = user?.email;
    return this.http.post<any>(`${BASE_URL}/customers/create`, {email: emailSend}).pipe(
      tap(() => {
        this.getCards().subscribe();
      })
    );
  }
  
  confirmOpenPayUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.registerOpenpayUser().subscribe(
        (res: any) => {
          this.user.setUser(res.user);
          this.customerId = res.customer.id || res.customer;
          resolve(this.customerId);  // Resuelve la Promise con customerId
        },
        (error: any) => {
          console.log('error: ', error.error);
          this.customerId = error.error.customer;
          resolve(this.customerId);  // Rechaza la Promise en caso de error
        }
      );
    });
  }

  generateOpenPayCard(data: any) {
    const token = this.auth.getToken();
    this.token = token ?? '';
    const header = { Authorization: `Bearer ${this.token}` };
    if (!this.token) {
      throw new Error('Token is required to generate an OpenPay Card.');
    }
    if (!data) {
      throw new Error('Data is required to generate an OpenPay Card.');
    }
    return this.http.post<any>(`${BASE_URL}/customers/cards/create`, {data}, {
      headers: header
    });
  }

  getCards(): Observable<any> {
    return from(this.confirmOpenPayUser()).pipe(
      switchMap(() => {
        return this.http.get<any>(`${BASE_URL}/customers/${this.customerId}/cards/list`, {});
      }),
      tap((res: any) => {
        this.cardsSubject.next(res.cards);
      })
    );
  }

  deleteCard(data: any) {
    const token = this.auth.getToken();
    this.token = token ?? '';
    const header = { Authorization: `Bearer ${this.token}` };
    if (!this.token) {
      throw new Error('Token is required to generate an OpenPay Card.');
    }
    if (!data) {
      throw new Error('Data is required to generate an OpenPay Card.');
    }
    return this.http.delete<any>(`${BASE_URL}/customers/cards/${data.cardId}/delete`, {body: data, headers: header}).pipe(
      tap(() => {
        this.getCards().subscribe();
      })
    );
  }
}
