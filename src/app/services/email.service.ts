import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EmailDataService {
  private emailFunctionUrl = environment.emailFunction;
  constructor(private http: HttpClient) {}
  enviarDatosEmail(data: any) {
    this.http.post(`${this.emailFunctionUrl}companyEmail`, data).subscribe(
      (response) => {
        console.log('Correo electrónico enviado exitosamente', response);
      },
      (error) => {
        console.log('Error al enviar el correo electrónico', error);
      }
    );
    this.http.post(`${this.emailFunctionUrl}clientEmail`, data).subscribe(
      (response) => {
        console.log('Correo electrónico enviado exitosamente', response);
      },
      (error) => {
        console.log('Error al enviar el correo electrónico', error);
      }
    );
  }
}
