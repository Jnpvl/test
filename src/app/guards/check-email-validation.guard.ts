import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class checkEmailValidationGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('verificationCode') === 'true') {
      console.log('Email not verified. Redirecting to OTP verification page.');
      this.router.navigate(['/auth/otp-verification']);
      return false;
    } else {
      return true;
    }
  }
}
