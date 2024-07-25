import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  selectedOption: string = '';
  comentarios: string = '';
  isActive: boolean = false;
  date: string = this.getCurrentDate();
  showCalendar: boolean = true;

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    return;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    if (option !== 'Otro') {
      this.comentarios = '';
    }
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());
    return `${year}-${month}-${day}`;
  }

  validateData(): boolean {
    if (this.selectedOption === '' || this.date === '') {
      return false;
    }
    return true;
  }

  goDirection() {
    this.router.navigate(['/home/schedule-service/direction'], {
      replaceUrl: true,
    });
  }

  goHome() {
    if (
      this.comentarios.trim() !== '' ||
      this.selectedOption !== '' ||
      this.isActive ||
      this.date !== ''
    ) {
      this.presentAlert();
    } else {
      this.clearFormAndNavigate();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de cancelar la solicitud?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.clearFormAndNavigate();
          },
        },
      ],
    });
    await alert.present();
  }

  clearFormAndNavigate() {
    this.selectedOption = '';
    this.comentarios = '';
    this.date = '';
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  sendRequest() {
    if (this.validateData()) {
      const selectedDate = new Date(this.date);
      selectedDate.setDate(selectedDate.getDate() + 1);
      this.scheduleService.selectedOption = this.selectedOption;
      this.scheduleService.comentarios = this.comentarios;
      this.scheduleService.date = selectedDate.toISOString().split('T')[0];
      console.log(
        'fecha',
        this.scheduleService.date,
        'opcion',
        this.scheduleService.selectedOption,
        'comentario',
        this.scheduleService.comentarios
      );
      this.goDirection();
    }
  }

  
}
