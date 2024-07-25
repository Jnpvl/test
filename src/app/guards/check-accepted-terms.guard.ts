import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CheckAcceptedTermsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('acceptedTerms') === 'true') {
      return true;
    } else {
      console.log('No se han aceptado los términos');
      this.router.navigate(['/auth/terms']);
      return false;
    }
  }
}
