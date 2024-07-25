import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Card } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/services/card.service';
import { PaymentEmailService } from 'src/app/services/payment-email.service';
import { PaymentService } from 'src/app/services/payment.service';
import { environment } from 'src/environments/environment';

declare var OpenPay: any;

@Component({
  selector: 'app-select-card',
  templateUrl: './select-card.page.html',
  styleUrls: ['./select-card.page.scss'],
})
export class SelectCardPage implements OnInit {
  deviceId: string = '';
  cards: Card[] = [];
  selectedCard: Card | null = null;
  selectedDocuments: any[] = [];
  totalSaldo: number = 0;
  description: string = '';
  tipoDeCambio: string = '';
  selectedCurrencyType: string | null = null;
  cotizas: string = '';
  chargeId: string = '';

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private cardService: CardService,
    private alertController: AlertController,
    private paymentService: PaymentService,
    private paymentEmailService : PaymentEmailService,
  ) { }

  ngOnInit() {
    this.setOpenPay();
    this.getCards();
    this.getParams();
    this.deviceId = OpenPay.deviceData.setup();
  }

  backPage() {
    this.router.navigate(['../'], { replaceUrl: true });
  }

  setOpenPay() {
    OpenPay.setId(environment.openpayId);
    OpenPay.setApiKey(environment.openpayPK);
    OpenPay.setSandboxMode(true);
  }

  getParams() {
    this.activatedRouter.queryParams.subscribe(params => {
      this.selectedDocuments = JSON.parse(params['selectedDocuments']);
      this.totalSaldo = +parseFloat(params['totalSaldo']).toFixed(2);
      this.description = params['description'];
      this.tipoDeCambio = params['tipoDeCambio'];
      this.selectedCurrencyType = params['currency'];
      this.cotizas = this.selectedDocuments.map((doc:any) => doc.cotiza).join(', ');
      this.chargeId = this.selectedDocuments.map((doc:any) => doc.cotiza).join('-');
    });
  }

  getCards() {
    this.cardService.getCards().subscribe(
      (res: any) => {
        if (res.cards.length === 0) {
          this.alertCards();
        } else {
          this.cards = res.cards;
        }
      },
      (error: any) => {
        console.error('Error during API call: ', error);
      }
    );
  }

  onCardSelected(card: Card) {
    this.selectedCard = card;
  }

  async processCheckout() {
    if (!this.selectedCard) {
      const alert = await this.alertController.create({
        header: 'Seleccione un método de pago',
        message: 'Seleccione una tarjeta para realizar el pago correspondiente',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // const cardData = await this.extractCardData("payment-form");
    const data = {
      source_id: this.selectedCard.id,
      method: 'card',
      amount: this.totalSaldo,
      currency: this.selectedCurrencyType === "Pesos Mexicanos" ? 'MXN' : 
              this.selectedCurrencyType === "Dolares Estadounidenses" ? 'USD' : 'MXN',
      description: this.description ? `Pago Libre: ${this.description} ${this.cotizas ? "("+this.cotizas+")" : ''}` : 
                  this.cotizas ? `Facturación de cotizaciones: ${this.cotizas}` : `Contribución libre`,
      order_id: `fac-${this.chargeId}`,
      device_session_id: this.deviceId
    };

    const alert = await this.alertController.create({
      header: 'Generar pago?',
      message: 'Esta seguro de generar el pago para los documentos con este metodo de pago?',
      buttons: [
        {
          text: 'PAGAR',
          role: 'confirmar',
          handler: () => {
            this.paymentService.generateCharge(data).subscribe(
              (res: any) => {
                const savedCharge = res.charge;
                this.paymentEmailService.sendEmail(savedCharge).subscribe(
                  response => {
                    this.alertNewCharge();
                    console.log('Email enviado con éxito', response);
                  },
                  emailError => {
                    this.alertErrorSendingEmail(emailError);
                    console.error('Error al enviar el correo', emailError);
                  }
                );
              },
              paymentError => {
                this.alertErrorCharge(paymentError);
                console.error('Error durante la llamada a la API de pago', paymentError);
              }
            );
          },
        },
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['../list']);
          }
        }
      ]
    });
    await alert.present();
  }

  async extractCardData(formId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      OpenPay.token.extractFormAndCreate(formId, (success: any) => {
        resolve(success.data);
      }, (error: any) => {
        console.log('Cayo en el error de extractFormAndCreate', error);
        reject(new Error(`Cayo en el error de extractFormAndCreate ${error}`));
      })
    })
  }

  async alertNewCharge() {
    const alert = await this.alertController.create({
      header: 'Pago realizado con éxito.',
      message: 'Tu pago se ha realizado con éxito. Te enviamos un correo con los detalles del cargo.',
      buttons: [
        {
          text: 'GRACIAS',
          role: 'confirmar',
          handler: () => {
            this.router.navigate(['../../../home/dashboard']).then(() => {
              window.location.reload();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async alertErrorCharge(error: any) {
    const alert = await this.alertController.create({
      header: `Error ${error.error.error_code}.`,
      message: `No se ha podido generar el cargo.
              Referencia: ${error.error.description}`,
      buttons: [
        {
          text: 'ENTENDIDO',
          role: 'confirmar',
          handler: () => {
            this.router.navigate(['../../../home/dashboard']).then(() => {
              window.location.reload();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async alertErrorSendingEmail(error: any) {
    const alert = await this.alertController.create({
      header: `Error al enviar el comprobante.`,
      message: 'El pago fue exitoso, pero hubo un problema al enviar el recibo por correo. Por favor, verifique su correo más tarde.',
      buttons: [
        {
          text: 'ENTENDIDO',
          role: 'confirmar',
          handler: () => {
            this.router.navigate(['../../../home/dashboard']).then(() => {
              window.location.reload();
            });
          }
        }
      ]
    });
    await alert.present();
  }
  
  async alertCards() {
    const alert = await this.alertController.create({
      header: 'No se ha registrado un metodo de pago.',
      message: 'Parece ser que aun no has registrado tu primera tarjeta. Porfavor ingrese un metodo de pago.',
      buttons: [
        {
          text: 'Ingresar tarjeta',
          role: 'confirmar',
          handler: () => {
            this.router.navigate(['../../../home/profile/payment-methods/new-card']);
          }
        }
      ]
    });
    await alert.present();
  }
}
