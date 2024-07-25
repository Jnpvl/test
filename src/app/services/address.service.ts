import { Injectable } from '@angular/core';
import { USER } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { BASE_URL } from '../global';
import { environment } from 'src/environments/environment.prod';
import { Address } from '../interfaces/address.interface';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private addressesFunctions  = environment.addressesFunctions;
  user: USER | null = null;
  token: string = '';

  constructor(private http: HttpClient, private userService: UserService) {
    this.token = window.localStorage.getItem('token') || '';
    this.user = this.userService.getUser();
  }

  async createAddress(address: Address): Promise<any> {
    try {
      const url = `${this.addressesFunctions}createAddress`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address)
      });
      return response.status;
    } catch (error) {
      console.error('Error al crear dirección en el servidor:', error);
      throw error;
    }
  }

  async deleteAddress(address: Address): Promise<any> {
    try {
      const url = `${this.addressesFunctions}deleteAddress`; 
      const response = await fetch(url, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address)
      });
      const result = await response.json(); 
      return result;
    } catch (error) {
      console.error('Error al eliminar dirección del servidor:', error);
      throw error;
    }
  }
  
  async updateAddress(address: Address): Promise<any> {
    try {
      const url = `${this.addressesFunctions}updateAddress`; 
      const response = await fetch(url, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address)
      });
      return response.status;
    } catch (error) {
      console.error('Error al actualizar dirección en el servidor:', error);
      throw error;
    }
  }

  async getAddresses(address: Address): Promise<any> {
    try {
      const url = this.generateUrl(`${this.addressesFunctions}getAddress`, address);
      const response = await fetch(url.toString());
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al obtener direcciones del servidor api:', address.userId, error);
      throw error;
    }
  }

  generateUrl(apiUrl: string, data: any) {
    const url = new URL(apiUrl);
    const params = data;
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return url;
  }
}
