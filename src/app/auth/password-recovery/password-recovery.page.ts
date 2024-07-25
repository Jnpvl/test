import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {
  email: string = '';
  emailValid: boolean = false;
  isAlertOpen = false;
  alert = {
    header: 'Error de recuperación',
    message: 'El correo electrónico no está registrado.',
    buttons: [{ text: 'Reintentar', handler: () => { this.setOpen(false); } }],
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    return;
  }

  sendCode() {
    if (this.emailValid) {
      this.authService.sendRecoveryCode(this.email).subscribe(
        (response: any) => {
          this.authService.setVerificationCode();
          this.router.navigate(['/auth/otp-verification'], { queryParams: { type: 'recover' ,email:this.email},replaceUrl:true });
        },
        (error: any) => {
          if (error.status === 404) { 
            this.setOpen(true);
          } else {
            console.error('Error al enviar el código de recuperación', error);
          }
        }
      );
    }
  }

  backToLogin() {
    this.router.navigate(['../'], { replaceUrl: true });
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    this.emailValid = emailPattern.test(this.email);
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}
