import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { USER } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  user: USER = {
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    email: '',
    id: 0,
    telefono: ''
  };

  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userData = this.userService.getUser();
    if (userData) {
      this.user = userData;
      this.formatCellular();
    }
  }

  formatCellular() {
    const numericValue = this.user.telefono.replace(/\D/g, '').slice(0, 10); 
    this.user.telefono = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  onPhoneInput(event: any) {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, '').slice(0, 10);
    event.target.value = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    this.user.telefono = event.target.value;
  }

  async update() {
    if (this.password !== this.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const userId = this.user.id;
    const updatedData = {
      nombre: this.user.nombre,
      apellidoP: this.user.apellidoP,
      apellidoM: this.user.apellidoM,
      email: this.user.email,
      telefono: this.user.telefono,
      password: this.password
    };

    this.userService.updateProfile(userId, updatedData).subscribe({
      next: async (response) => {
        await this.showAlert('Éxito', 'Perfil actualizado correctamente.');
        this.userService.setUser(response.user);
        if (this.password) {
          this.password = '';
          this.confirmPassword = '';
        }
      },
      error: async (error) => {
        await this.showAlert('Error', 'No se pudo actualizar el perfil. Intenta nuevamente.');
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
