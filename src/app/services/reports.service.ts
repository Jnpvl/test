import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from '../interfaces/activity.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BASE_URL } from '../global';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private currentActivitySubject: BehaviorSubject<Activity | null> = new BehaviorSubject<Activity | null>(null);
  public currentActivity$ = this.currentActivitySubject.asObservable();

  token: string = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private iab: InAppBrowser,
  ) {
    this.token = this.auth.getToken() || '';
  }



  getProyectReport(nproyecto: string, ntarea?: string) {
    const token = this.token;

    let params = new HttpParams();
    params = params.append('nproyecto', nproyecto)
    if (ntarea) {
      params = params.append('ntarea', ntarea)
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return new Observable<void>((observer) => {
      const url = `${BASE_URL}/reports`;
      this.http.post<{ url: string }>(url, {}, { params: params, headers: headers }).subscribe(
        (response) => {
          console.log('respuesta:', response);
          this.iab.create(response.url, '_system');
          observer.next();
          observer.complete();
        },
        error => {
          console.error('Error downloading the report:', error);
          observer.error(error);
        }
      )
    });
  }
}