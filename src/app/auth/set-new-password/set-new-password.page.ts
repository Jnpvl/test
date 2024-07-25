import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.page.html',
  styleUrls: ['./set-new-password.page.scss'],
})
export class SetNewPasswordPage implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  email: string = '';

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() { 
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  async validation() {
    if (this.newPassword.length < 8 || this.confirmPassword.length < 8) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'La contraseña debe tener al menos 8 caracteres.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    
    this.resetPassword();
  }

  async resetPassword() {
    try {
      await this.authService.resetPassword(this.email, this.newPassword).toPromise();
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'La contraseña se ha restablecido correctamente.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/auth/login'],{ replaceUrl: true });
          }
        }]
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al restablecer la contraseña.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}

