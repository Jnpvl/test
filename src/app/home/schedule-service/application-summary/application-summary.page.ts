import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Folio } from 'src/app/interfaces/folio.interface';
import { EmailDataService } from 'src/app/services/email.service';
import { RequestFolioService } from 'src/app/services/folio.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SummaryParamsService } from 'src/app/services/sumamary-params.service';
@Component({
  selector: 'app-application-summary',
  templateUrl: './application-summary.page.html',
  styleUrls: ['./application-summary.page.scss'],
})
export class ApplicationSummaryPage implements OnInit {
  summaryParams: any;
  modifiedComentarios: string = '';
  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private SummaryParamsService: SummaryParamsService,
    private EmailDataService: EmailDataService,
    private ScheduledServiceService: ScheduleService,
    private RequestFolioService: RequestFolioService
  ) {}

  ngOnInit() {
    this.summaryParams = this.SummaryParamsService.getSummaryParams();
  }
  async addFolio() {
    try {
      const existingFolios = await this.RequestFolioService.getFolio();
      const highestFolio = existingFolios.reduce(
        (max: any, folio: any) => Math.max(max, folio.folio),
        0
      );
      const nextFolio = highestFolio + 1;

      const newFolio: Folio = {
        userId: this.summaryParams.userId,
        services: this.summaryParams.selectedOption,
        folio: nextFolio,
      };

      this.summaryParams.folio = newFolio.folio;
      await this.RequestFolioService.createFolio(newFolio);
    } catch (error) {
      console.error('Error al agregar el folio:', error);
    }
  }

  async enviarEmail() {
    if (
      this.summaryParams.comentarios === '' &&
      this.modifiedComentarios === ''
    ) {
      this.summaryParams.comentarios = 'No hay comentarios para esta solicitud';
    } else if (
      this.summaryParams.comentarios === '' &&
      this.modifiedComentarios.trim() !== ''
    ) {
      this.summaryParams.comentarios = this.modifiedComentarios;
    } else if (
      this.summaryParams.comentarios !== '' &&
      this.modifiedComentarios.trim() !== ''
    ) {
      this.summaryParams.comentarios =
        (this.summaryParams.comentarios
          ? this.summaryParams.comentarios + '\n'
          : '') + this.modifiedComentarios;
    }

    await this.Email();
  }

  async requestSent() {
    const alert = await this.alertController.create({
      header: 'Solicitud enviada',
      message: `
        Su solicitud fue enviada correctamente
      
    `,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          role: 'confirmar',
          handler: () => {
            this.cleanFields();
          },
        },
      ],
      cssClass: [],
    });
    alert.onDidDismiss().then(() => {
      this.cleanFields();
    });

    await alert.present();
  }

  cleanFields() {
    this.ScheduledServiceService.selectedOption = '';
    this.ScheduledServiceService.date = '';
    this.ScheduledServiceService.comentarios = '';
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  async cancelRequest() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de cancelar la solicitud?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelacion cancelada');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.cleanFields();
          },
        },
      ],
    });

    await alert.present();
  }

  async Email() {
    await this.showLoading();
    try {
      await this.addFolio();
      await this.EmailDataService.enviarDatosEmail(this.summaryParams);
      await this.requestSent();
    } catch (error) {
      console.error(`Error al asignar folio: ${error}`);
    }
    this.loadingController.dismiss();
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Creando solicitud ...',
    });
    await loading.present();
  }
}
