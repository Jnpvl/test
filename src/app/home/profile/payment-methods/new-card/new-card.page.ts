import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.page.html',
  styleUrls: ['./new-card.page.scss'],
})
export class NewCardPage implements OnInit {
  cards: any | null = null;
  isAlertOpen = false;
  alert = {
    header: 'Error de registro',
    message: 'Por favor, llena todos los campos correctamente.',
    buttons: [{text: 'Reintentar', handler: () => {} }],
  };
  formularioCard = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]*$')
    ]),
    numero: new FormControl('', [
      Validators.required,
      Validators.minLength(12),
      Validators.maxLength(19),
      Validators.pattern('^[0-9]*$')
    ]),
    anioVigencia: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern('^[0-9]*$')
    ]),
    mesVigencia: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2),
      Validators.pattern('^[0-9]*$')
    ]),
    cvv2: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(4),
      Validators.pattern('^[0-9]*$')
    ]),
  });

  cardType = 'Unknown';

  constructor(
    private route: Router, 
    private cardService: CardService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cardService.confirmOpenPayUser();
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  formatCardNumber(cardNumber: string | null | undefined): string {
    if (cardNumber) {
      this.cardType = this.detectCardType(cardNumber);
      return cardNumber.replace(/(.{4})/g, '$1 ').trim();
    } else {
      return '';
    }
  }

  formatCardNumberInput(event: any) {
    const input = event.target;
    const cursorPosition = input.selectionStart;
    const cleaned = input.value.replace(/\D/g, '');
    let formatted = '';

    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && 1 % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }

    input.value = formatted;
    input.setSelectionRange(cursorPosition, cursorPosition);
    this.formularioCard.patchValue({ numero: cleaned });
  }

  detectCardType(cardNumber: string): string {
    const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardPattern = /^5[1-5][0-9]{14}$/;
    const amexPattern = /^3[47][0-9]{13}$/;
    const discoverPattern = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
    if (visaPattern.test(cardNumber)) {
      return 'Visa';
    } else if (mastercardPattern.test(cardNumber)) {
      return 'Mastercard';
    } else if (amexPattern.test(cardNumber)) {
      return 'Amex';
    } else if (discoverPattern.test(cardNumber)) {
      return 'Discover';
    } else {
      return 'Unknown';
    }
  }

  create() {
    this.cardService.generateOpenPayCard(this.formularioCard.value)
    .subscribe(
      (res: any) => {
        if (res) {
          console.log('tarjeta aceptada');
          this.alertNewCard();
        }
      },
      (error: any) => {
        this.cardErrorExists(error);
      }
    );
  }

  async alertNewCard() {
    const alert = await this.alertController.create({
      header: 'Nueva Tarjeta generada.',
      message: `Nueva tarjeta generada con exito.`,
      buttons:  [
        {
          text: 'OK',
          role: 'confirmar',
          handler: () => {
            this.cardService.getCards().subscribe();
            this.route.navigate(['../../../../home/profile/payment-methods/list'], { replaceUrl: true });
          }
        }
      ],
      cssClass: []
    });
    await alert.present();
  }

  async cardErrorExists(error: any) {
    const alert = this.alertController.create({
      header: `Error ${error.error.error_code}.`,
      message: `No se ha podido generar la tarjeta.
              Referencia: ${error.error.description}.`,
      buttons: [
        {
          text: 'OK',
          role: 'confirmar',
        }
      ],
      cssClass: []
    });
    (await alert).present();
  }
}
