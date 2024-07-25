import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BASE_URL } from '../global';
import { Proyect } from '../interfaces/proyect.interface';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private currentProjectSubject: BehaviorSubject<Proyect | null> = new BehaviorSubject<Proyect | null>(null);
  public currentProject$ = this.currentProjectSubject.asObservable();
  token: string = '';

  constructor(
    private _http: HttpClient, 
    private auth: AuthService
  ) {
    this.token = this.auth.getToken() || '';
  }

  getProyects() {
    return this._http.post<Proyect[]>(`${BASE_URL}/proyects`, {}, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).pipe(
      map((proyects: Proyect[]) => {
        const sortedProjects = proyects.sort((a, b) => {
          const dateA = new Date(a.FechaInicio).getTime();
          const dateB = new Date(b.FechaInicio).getTime();
          return dateB - dateA;
        });
        return sortedProjects;
      })
    );
  }

  getTop5Proyects() {
    return this._http.post<Proyect[]>(`${BASE_URL}/proyects`, {}, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).pipe(
      map((proyects: Proyect[]) => {
        const sortedProjects = proyects.sort((a, b) => {
          const dateA = new Date(a.FechaInicio).getTime();
          const dateB = new Date(b.FechaInicio).getTime();
          return dateB - dateA;
        });
        return sortedProjects.slice(0, 5);
      })
    );
  }

  setCurrentProject(project: Proyect): void {
    this.currentProjectSubject.next(project);
  }

  getCurrentProject(): Proyect | null {
    return this.currentProjectSubject.value;
  }
}
