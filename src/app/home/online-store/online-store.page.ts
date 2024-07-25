import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-online-store',
  templateUrl: './online-store.page.html',
  styleUrls: ['./online-store.page.scss'],
})
export class OnlineStorePage implements OnInit {
  timeLeft: number = 5;
  interval: any;

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.abrirTienda();
      }
    }, 1000);
  }

  abrirTienda() {
    window.open('https://tienda.clima3.mx/', '_system');
    this.modalController.dismiss();
    clearInterval(this.interval);
  }

  cerrarTienda() {
    this.modalController.dismiss();
    clearInterval(this.interval);
  }
}
