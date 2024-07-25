import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isAlertOpen = false;
  alertOptions = {
    header: 'Error de inicio de sesión',
    message: 'Por favor, llena todos los campos correctamente.',
    buttons: ['Reintentar'],
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  presentLoading() {
    this.loadingCtrl
      .create({
        message: 'Accediendo...',
        spinner: 'crescent',
      })
      .then((loadingEl) => {
        loadingEl.present();
      });
  }

  loadingDismiss() {
    this.loadingCtrl.dismiss();
  }

  login() {
    this.authService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .subscribe(
        (data) => {
          this.loadingDismiss();

          const { openpayId, externalId, ...restUser } = data.user;
          this.userService.setUser(restUser);
          this.authService.setToken(data.token);
          this.router.navigate(['../home'],{ replaceUrl: true });
        },
        (error) => {
          this.loadingDismiss();
          this.errorCredentials();
          this.setOpen(true);
        }
      );
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  loginSubmit() {
    if (this.loginForm.valid) {
      this.presentLoading();
      this.login();
    } else {
      this.errorRequiredFields();
      this.setOpen(true);
    }
  }

  errorCredentials() {
    this.alertOptions.header = 'Error de inicio de sesión';
    this.alertOptions.message = 'Revisa tus credenciales e intenta de nuevo.';
    this.setOpen(true);
  }

  errorRequiredFields() {
    this.alertOptions.header = 'Error de inicio de sesión';
    this.alertOptions.message =
      'Por favor, llena todos los campos correctamente e inténtalo nuevamente.';
    this.setOpen(true);
  }
}
