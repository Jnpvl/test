import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../global';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignatureService {
  token = this.authService.getToken();
  constructor(private _http: HttpClient, private authService: AuthService) { }

  getSignature = (idProyecto: string, idTarea?: string) => {
    if (!idTarea) {
      return this._http.get(`${BASE_URL}/signatures/${idProyecto}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    }

    return this._http.get(`${BASE_URL}/signatures/${idProyecto}/${idTarea}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  };

  getAllSignatureByProject =(idProyecto:string)=>{
    return this._http.get(`${BASE_URL}/signatures/proyecto/${idProyecto}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  postSignatureP = (idProyecto: string, firma: string) => {
    return this._http.post(
      `${BASE_URL}/signatures`,
      {
        idProyecto,
        firma,
        isTaskLevel: false,
      },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
  };
  postSignatureA = (idProyecto: string, idTarea: String, firma: string) => {
    return this._http.post(
      `${BASE_URL}/signatures`,
      {
        idProyecto,
        idTarea,
        firma,
        isTaskLevel: true,
      },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
  };
}
