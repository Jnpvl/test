import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss']
})
export class OtpVerificationPage implements OnInit {
  confirmCodeFunction!: (code: string) => Observable<any>;
  successMessage!: string;
  errorMessage!: string;
  successHandler!: () => void;
  email:string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['type'] === 'register') {
        this.confirmCodeFunction = this.authService.confirmRegisterCode.bind(this.authService);
        this.successMessage = 'El código de registro es correcto, ya puede iniciar sesión en la plataforma.';
        this.errorMessage = 'Por favor, verifique que el código de registro coincida con el enviado a su correo electrónico.';
        this.successHandler = this.navigateToLogin.bind(this);
      } else if (params['type'] === 'recover' && params['email']) {
        this.email = params['email'];
        this.confirmCodeFunction = this.authService.confirmRecoveryCode.bind(this.authService,this.email);
        this.successMessage = 'El código de recuperación es correcto, ya puede restablecer su contraseña.';
        this.errorMessage = 'Por favor, verifique que el código de recuperación coincida con el enviado a su correo electrónico.';
        this.successHandler = this.navigateToResetPassword.bind(this);
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login'],{ replaceUrl: true });
  }

  navigateToResetPassword() {
    this.router.navigate(['/auth/set-new-password'],{ queryParams: { email: this.email},replaceUrl:true});
  }
}
