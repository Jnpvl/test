import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../global';
import { AuthService } from './auth.service';
import { Document } from '../interfaces/document.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  token: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.token = this.authService.getToken() || '';
  }

  getDocuments() {
    const header = { Authorization: `Bearer ${this.token}` };
    return this.http.post<Document[]>(`${BASE_URL}/documents`, {
      
    }, {
      headers: header
    });
  }
}
