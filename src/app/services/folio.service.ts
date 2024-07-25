import { Injectable } from '@angular/core';
import { Folio } from '../interfaces/folio.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RequestFolioService {
  private folioFunctions = environment.folioFunctions;
  constructor() {}

  async createFolio(folio: Folio): Promise<any> {
    try {
      const url = this.generateUrl(`${this.folioFunctions}assignFolio`, folio);
      const response = await fetch(url.toString());
      console.log('Folio asignado a la solicitud', response);
      return response;
    } catch (error) {
      console.error('Error al asignar folio en el servidor:', error);
      throw error;
    }
  }

  async getFolio(): Promise<any> {
    try {
      const url = this.generateUrl(`${this.folioFunctions}getFolio`, {});

      const response = await fetch(url.toString());
      console.log('Respuesta del servidor:', response);
      const result = await response.json();
      console.log('result', result);

      return result;
    } catch (error) {
      console.error('Error al obtener folios del servidor api:', error);
      throw error;
    }
  }

  generateUrl(apiUrl: string, data: any) {
    const url = new URL(apiUrl);
    const params = data;
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    return url;
  }
}
