import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TermsService {
  termsAccepted = false;

  constructor() {
    if (window.localStorage.getItem('acceptedTerms') === 'true') {
      this.termsAccepted = true;
    }
  }

  setTermsAccepted() {
    this.termsAccepted = true;
    window.localStorage.setItem('acceptedTerms', 'true');
  }

  getTermsAccepted() {
    return this.termsAccepted;
  }
}
