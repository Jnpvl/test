import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Address} from 'src/app/interfaces/address.interface';
import { AddressService } from 'src/app/services/address.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-listaddress',
  templateUrl: './listaddress.page.html',
  styleUrls: ['./listaddress.page.scss'],
})
export class ListaddressPage implements OnInit {
  direcciones: Address[] = [];
  userId: number | undefined;
  selectedAddress: Address | null = null;

  constructor(
    private router: Router, 
    private AddressService: AddressService,
    private userService: UserService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.direcciones=[]
  }

  ngOnInit() {
    this.loadingAddress();
    const userData = this.userService.getUser();
    this.userId = userData?.id;
  }

  ionViewWillEnter(){
    this.getAddress()
  }
  backPage() {
    this.router.navigate(['../']);
  }

  async loadingAddress() {
    await this.showLoading();
    try {
      await this.getAddress();
    } catch (error) {
      console.error(`Error al cargar las direcciones: ${error}`);
    }
    this.loadingController.dismiss();
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando direcciones...',
    });
    await loading.present();
  }

  async getAddress() {
    try {
      if (!this.userId) {
        console.error("UserID no disponible.");
        return;
      }
      const address: Address = {
        userId: this.userId,
        email: '',
        cellular: '',
        street: '',
        colony: '',
        city: '',
        state: '',
        cp: '',
        number: '',
        numeroInterior: '',
        referencias: '',
        name: '',
        direccion_principal: false
      };
      const addresses = await this.AddressService.getAddresses(address);
      this.direcciones = addresses.sort((a: { direccion_principal: any; }, b: { direccion_principal: any; }) => {
        return (b.direccion_principal ? 1 : 0) - (a.direccion_principal ? 1 : 0);
      });
    } catch (error) {
      console.error(`Error al obtener las direcciones: ${error}`);
    }
  }

  editAddress(direccion: Address){
    this.router.navigate(['/home/profile/addressbook/newaddress'],{state: {direccion}});
  }

  async confirmDeleteAddress(direccion: Address) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta dirección?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteAddress(direccion);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAddress(direccion: Address) {
    const index = this.direcciones.findIndex(dir => dir === direccion);
    if (index !== -1) {
      this.direcciones.splice(index, 1);
      if (this.selectedAddress === direccion) {
        this.selectedAddress = null;
      }

      this.AddressService.deleteAddress(direccion).then((response) => {
      });
    }
  }
  
}
