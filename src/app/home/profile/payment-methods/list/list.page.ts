import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Card } from 'src/app/interfaces/card.interface';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  cards: Card[] = [];
  filteredCards: Card[] = [];
  selectedCard: Card | null = null;
  constructor(
    private router: Router,
    private CardService: CardService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.CardService.cards.subscribe((cards) => {
      this.cards = cards;
      this.filteredCards = [...this.cards];
    });
    this.CardService.getCards().subscribe();
  }

  backPage() {
    this.router.navigate(['../']);
  }

  onCardSelected(card: Card) {
    this.selectedCard = card;
  }

  getCards() {
    this.CardService.getCards().subscribe(
      (res: any) => {
        this.cards = res.cards;
        this.filteredCards = [...this.cards];
      },
      (error) => {
        console.error('Error during API call: ', error);
      }
    )
  }

  async deleteCard() {
    if (!this.selectedCard) {
      const alert = await this.alertController.create({
        header: 'Seleccione una Tarjeta',
        message: 'Seleccione una tarjeta para eliminar del sistema.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const data = {
      cardId: this.selectedCard.id
    }

    const alert = await this.alertController.create({
      header: 'Borrar tarjeta?',
      message: 'Esta seguro de eliminar la tarjeta?',
      buttons: [
        {
          text: 'ELMINAR',
          role: 'confirmar',
          handler: () => {
            this.CardService.deleteCard(data).subscribe(
              (res: any) => {
                this.alertDeleteCard();
              },
              (error) => {
                console.log('Error during API call', error);
                this.alertErrorDeleteCard(error);
              }
            );
          },
        },
        {
          text: 'CANCELAR',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async alertDeleteCard() {
    const alert = await this.alertController.create({
      header: 'Tarjeta eliminada.',
      message: 'Tarjeta eliminada con exito.',
      buttons: [
        {
          text: 'OK',
          role: 'confirmar'
        }
      ]
    });
    await alert.present();
  }

  async alertErrorDeleteCard(error: any) {
    const alert = await this.alertController.create({
      header: `Error Tarjeta`,
      message: `Error al momento de eliminar la tarjeta.`,
      buttons: [
        {
          text: 'OK',
          role: 'confirmar'
        }
      ]
    });
    await alert.present();
  }
}
