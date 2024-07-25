import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BASE_URL } from '../global';
import { Activity } from '../interfaces/activity.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private currentActivitySubject: BehaviorSubject<Activity | null> = new BehaviorSubject<Activity | null>(null);
  public currentActivity$ = this.currentActivitySubject.asObservable();
  token : string = ''
  constructor(private http: HttpClient, private auth: AuthService) {
    this.token =  this.auth.getToken() || '';
  }

  getDashboardActivities() {
    return this.http.post<Activity[]>(`${BASE_URL}/activities?dashboard=true`, {});
  }

  getActivities(idProyecto: string) {
    return this.http.post<Activity[]>(
      `${BASE_URL}/activities?idProyecto=` + idProyecto,{}, {
        headers: {Authorization: `Bearer ${this.token}` }}
    );
  }

  getPhotos(idTarea: string){
    return this.http.post<Activity[]>(
      `${BASE_URL}/activities/photos`,{idTarea}, {
        headers: {Authorization: `Bearer ${this.token}` }}
    );
  } 
  setCurrentActivity(activity: Activity): void {
    this.currentActivitySubject.next(activity);
  }

  getCurrentActivity(): Activity | null {
    return this.currentActivitySubject.value; 
  }
}
