import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address.service';
import { UserService } from 'src/app/services/user.service';

import { Geolocation } from '@capacitor/geolocation';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { environment } from 'src/environments/environment.prod';
import { Address } from 'src/app/interfaces/address.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-newaddress',
  templateUrl: './newaddress.page.html',
  styleUrls: ['./newaddress.page.scss'],
})
export class NewaddressPage implements OnInit {
  private googleApiKey = environment.googleApiKey;
  direcciones: Address[] = [];
  direccion: Address | undefined;

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

  isValidEmail: boolean = true;
  isValidCellular: boolean = true;
  isNameDisabled: boolean = false;

  latitude: number | undefined;
  longitude: number | undefined;
  userId: number | undefined;

  editingAddressId?: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertController: AlertController,
    private http: HttpClient,
    private AddressService: AddressService
  ) {
    this.direcciones = [];
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.direccion = navigation?.extras.state?.['direccion'];
    if (this.direccion) {
      this.editForm(this.direccion);
    }
    const userData = this.userService.getUser();
    this.userId = userData?.id;
    this.getAddress()
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
      this.direcciones = addresses;
    } catch (error) {
      console.error(`Error al obtener las direcciones: ${error}`);
    }
  }

  editForm(address: Address) {
    if(address){
      this.name = address.name;
      this.email = address.email;
      this.cellular = address.cellular;
      this.street = address.street;
      this.colony = address.colony;
      this.city = address.city;
      this.state = address.state;
      this.cp = address.cp;
      this.number = address.number;
      this.numberInt = address.numeroInterior;
      this.referencias = address.referencias;
      this.direccion_principal = address.direccion_principal;
      this.isNameDisabled =true
    }else{
      this.isNameDisabled =false
    }
   
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

  addDirection() {
    if (this.validateData()) {
      if (!this.userId) {
        console.error("UserID no disponible.");
        return;
      }

      if (this.direccion) {
        if (this.direccion_principal) {
          const existingPrimary = this.direcciones.find(dir => dir.direccion_principal && dir !== this.direccion);
          if (existingPrimary) {
            existingPrimary.direccion_principal = false;
            this.AddressService.updateAddress(existingPrimary);
          }
        }
        const updatedAddress = {
          ...this.direccion,
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
        this.AddressService.updateAddress(updatedAddress).then(() => {
          this.clearData();
        });
      } else {
        const trimmedName = this.name.trim();
        let existingAddress = this.direcciones.find(direccion => direccion.name.trim() === trimmedName);
        if (existingAddress) {
          this.repeatName();
          return;
        }
        if (this.direccion_principal) {
          const existingPrimary = this.direcciones.find(dir => dir.direccion_principal);
          if (existingPrimary) {
            existingPrimary.direccion_principal = false;
            this.AddressService.updateAddress(existingPrimary);
          }
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
        this.AddressService.createAddress(newAddress).then(() => {
          this.clearData();
        });
      }
    }
  }

  validateData(): boolean {
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
    return true;
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
    this.confirmAlert()
  }

  async confirmAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmacion',
      message: 'Direccion creada correctamente',
      buttons: [
        {
          text: 'Aceptar',
          role: 'Aceptar',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigate(['../'], { relativeTo: this.route, replaceUrl: true });
          }
        },
      ]
    });

    await alert.present();
  }

  openSettings(app = false) {
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });
  }
}
