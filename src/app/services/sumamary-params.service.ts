import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SummaryParamsService {
  summaryParams: any;

  constructor() {}

  setSummaryParams(params: any) {
    this.summaryParams = params;
  }

  getSummaryParams() {
    return this.summaryParams;
  }
}
