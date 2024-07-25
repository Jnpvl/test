import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';
import { Address } from 'src/app/interfaces/address.interface';
import { AddressService } from 'src/app/services/address.service';
import { UserService } from 'src/app/services/user.service';

import { Geolocation } from '@capacitor/geolocation';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SummaryParamsService } from 'src/app/services/sumamary-params.service';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.page.html',
  styleUrls: ['./direction.page.scss'],
})
export class DirectionPage implements OnInit {
  private googleApiKey = environment.googleApiKey;
  selectedTab: string = 'direcciones';
  direcciones: Address[] = [];
  completeName: string | undefined;
  userId: number | undefined;
  name: string = '';
  email: string = '';
  cellular: string = '';
  street: string = '';
  colony: string = '';
  city: string = '';
  state: string = '';
  cp: string = '';
  number: string = '';
  numberInt: string = '';
  referencias: string = '';
  direccion_principal: boolean = false;
  folio: number = 0;
  isValidEmail: boolean = true;
  isValidCellular: boolean = true;
  selectedAddress: Address | null = null;
  isNameDisabled: boolean = false;
  latitude: number | undefined;
  longitude: number | undefined;

 
  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private http: HttpClient,
    private userService: UserService,
    private AddressService: AddressService,
    private ScheduledService: ScheduleService,
    private SummaryParamsService:SummaryParamsService,
  ) { 
    this.direcciones = [];
  }

  ngOnInit() {
    this.loadingAddress();
    const userData = this.userService.getUser();
    this.userId = userData?.id;
    const clientName = userData?.nombre ;
    const clientAP = userData?.apellidoP ;
    const clientAM = userData?.apellidoM ;
    this.completeName =  clientName + ' ' + clientAP + ' ' + clientAM;
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

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  selectAddress(direccion: Address) {
    this.name = direccion.name;
    this.email = direccion.email;
    this.cellular = direccion.cellular;
    this.street = direccion.street;
    this.colony = direccion.colony;
    this.city = direccion.city;
    this.state = direccion.state;
    this.cp = direccion.cp;
    this.number = direccion.number;
    this.numberInt = direccion.numeroInterior;
    this.referencias = direccion.referencias;
    this.direccion_principal = direccion.direccion_principal;
    this.selectedAddress = direccion;
  }

  addDirection() {
    if (this.validateData()) {
      const trimmedName = this.name.trim();
      let existingAddress;
  
      if (this.direcciones.length > 0) {
        existingAddress = this.direcciones.find(direccion => direccion.name.trim() === trimmedName);
        if (existingAddress && existingAddress !== this.selectedAddress) {
          this.repeatName();
          return; 
        }
      }
      if (this.direccion_principal) {
        this.direcciones.forEach((direccion) => {
          if (direccion.direccion_principal && direccion !== this.selectedAddress) {
            direccion.direccion_principal = false;
            this.AddressService.updateAddress(direccion).then(() => {
            });
          }
        });
      }
  
      if (this.selectedAddress) {
        const index = this.direcciones.findIndex(dir => dir === this.selectedAddress);
        if (index !== -1) {
          this.direcciones[index].email = this.email;
          this.direcciones[index].street = this.street;
          this.direcciones[index].colony = this.colony;
          this.direcciones[index].city = this.city;
          this.direcciones[index].state = this.state;
          this.direcciones[index].cp = this.cp;
          this.direcciones[index].cellular = this.cellular;
          this.direcciones[index].number = this.number;
          this.direcciones[index].numeroInterior = this.numberInt;
          this.direcciones[index].referencias = this.referencias;
          this.direcciones[index].direccion_principal = this.direccion_principal;

          this.AddressService.updateAddress(this.direcciones[index]).then((response) => {
         
          });
        }
        this.selectedAddress = null;
      } else {
        if (!this.userId) {
          console.error("UserID no disponible.");
          return;
        }
        const newAddress = {
          userId: this.userId,
          name: this.name,
          email: this.email,
          cellular: this.cellular,
          street: this.street,
          colony: this.colony,
          city: this.city,
          state: this.state,
          cp: this.cp,
          number: this.number,
          numeroInterior: this.numberInt,
          referencias: this.referencias,
          direccion_principal: this.direccion_principal 
        };
        this.AddressService.createAddress(newAddress).then((response) => {
        });
      }
      this.datosCliente();
      this.clearData();
    }
  }

  editAddress(direccion: Address | null) {
    if (direccion) {
      this.name = direccion.name;
      this.email = direccion.email;
      this.cellular = direccion.cellular;
      this.street = direccion.street;
      this.city = direccion.city;
      this.colony = direccion.colony;
      this.state = direccion.state;
      this.number = direccion.number;
      this.numberInt = direccion.numeroInterior;
      this.cp = direccion.cp;
      this.referencias = direccion.referencias;
      this.selectedAddress = direccion;
      this.isNameDisabled = true;
      this.direccion_principal = direccion.direccion_principal
    } else {
      this.clearData();
      this.selectedAddress = null;
      this.isNameDisabled = false;
    }
    this.selectedTab = 'agregar';
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

  async getPosition() {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      if (permissionStatus?.location != 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location != 'granted') {
          await this.openSettings(true);
          return;
        }
      }
      let options: PositionOptions = {
        maximumAge: 3000,
        timeout: 1000,
        enableHighAccuracy: true
      };
      const position = await Geolocation.getCurrentPosition(options);

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      this.getAddressFromCoordinates(this.latitude, this.longitude);

    } catch (e: any) {
      if (e?.message === 'El servicio de localizacion no esta disponible') {
        await this.openSettings();
      }
      console.log(e);
    }
  }

  getAddressFromCoordinates(latitude: number, longitude: number) {
    const apiKey = this.googleApiKey;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    this.http.get(apiUrl).subscribe((response: any) => {
      if (response.status === 'OK' && response.results.length > 0) {
        const addressComponents = response.results[0].address_components;
        const streetComponent = addressComponents.find((component: { types: string | string[]; }) =>
          component.types.includes('route')
        );
        const colonyComponent = addressComponents.find((component: { types: string | string[]; }) =>
          component.types.includes('sublocality')
        );
        const municipalityComponent = addressComponents.find((component: { types: string | string[]; }) =>
          component.types.includes('locality')
        );
        const stateComponent = addressComponents.find((component: { types: string | string[]; }) =>
          component.types.includes('administrative_area_level_1')
        );
        const numberComponent = addressComponents.find((component: { types: string | string[]; }) =>
          component.types.includes('street_number')
        );
        const postalCodeComponent = addressComponents.find((component: { types: string | string[]; }) =>
          component.types.includes('postal_code')
        );
        this.street = streetComponent ? streetComponent.long_name : '';
        this.colony = colonyComponent ? colonyComponent.long_name : '';
        this.city = municipalityComponent ? municipalityComponent.long_name : '';
        this.state = stateComponent ? stateComponent.long_name : '';
        this.number = numberComponent ? numberComponent.long_name : '';
        this.cp = postalCodeComponent ? postalCodeComponent.long_name : '';

      } else if (response.status === 'ZERO_RESULTS') {
        ;
        alert('No se encontraron resultados para su ubicacion actual.');
      } else {
        alert('Error al obtener la dirección.');
      }
    }, (error) => {
      alert('Error al realizar la solicitud');
    });
  }

  openSettings(app = false) {
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isValidEmail = emailPattern.test(this.email);
  }

  formatCellular(event: any) {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    const formattedValue = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    this.cellular = formattedValue;
  }

  validateData(): boolean {
    if (this.selectedTab === 'agregar') {
      if (
        !this.name?.trim() || 
        !this.email?.trim() || 
        !this.street?.trim() || 
        !this.colony?.trim() || 
        !this.city?.trim() || 
        !this.state?.trim() || 
        !this.referencias?.trim() || 
        !this.number?.trim() || 
        !this.cp?.trim() || 
        !this.isValidEmail || 
        (this.cellular?.trim().length < 10)
      ) {
        return false;
      }
    } else if (this.selectedTab === 'direcciones') {
      if (!this.selectedAddress) {
        return false;
      }
    }
    return true;
  }

  async repeatName() {
    const alert = await this.alertController.create({
      header: 'Nombre repetido',
      message: `
       El nombre de la dirección ya fue utilizado
    `,
      buttons: [
        {
          text: 'Ok',
          role: 'confirmar',
          handler: () => {
            console.log("confirmacion de alerta");
          },

        }
      ],
      cssClass: []
    });
    await alert.present();

  }

  async datosCliente() {
    const fechaFormateada = !this.ScheduledService.date
      ? 'Lo más pronto posible'
      : new Date(this.ScheduledService.date).toLocaleDateString('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    const urgentService = !this.ScheduledService.selectedOption
      ? 'Servicio Urgente'
      : this.ScheduledService.selectedOption;

    const summaryParams = {
      selectedOption: urgentService,
      comentarios: this.ScheduledService.comentarios,
      date: fechaFormateada,

      userName: this.completeName,

      email: this.email,
      cellular: this.cellular,
      street: this.street,
      colony: this.colony,
      city: this.city,
      state: this.state,
      cp: this.cp,
      number: this.number,
      numeroInterior: this.numberInt,
      referencias:this.referencias,
      userId: this.userId,
      direccion_principal: this.direccion_principal

    }
    this.SummaryParamsService.setSummaryParams(summaryParams);
     this.router.navigate(['/home/schedule-service/application-summary'], { replaceUrl: true });
  }

  clearData() {
    this.name = '';
    this.email = '';
    this.street = '';
    this.colony = '';
    this.city = '';
    this.state = '';
    this.number = '';
    this.numberInt = '';
    this.cp = '';
    this.cellular = '';
    this.referencias = '';
    this.direccion_principal = false;  
  }

  async cancelRequest() {
    const alert = await this.alertController.create({
      header: 'Confirmacion',
      message: '¿Estás seguro de cancelar la solicitud?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelacion cancelada');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/home'], { replaceUrl: true });
            this.clearData();
          }
        }
      ]
    });

    await alert.present();
  }
}
