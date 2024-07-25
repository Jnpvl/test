import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  userData: string = '';
  selectedOption: string = '';
  comentarios: string = '';
  date: string = '';

  constructor() {}
}
