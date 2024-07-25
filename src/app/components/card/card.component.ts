import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() cards: Card[] = [];
  showDebitCards: boolean = false;
  showAllCards: boolean = true;
  filteredCards: Card[] = [];
  constructor() {}

  ngOnInit() {}

  getCards() {
    return this.filteredCards = this.cards;
  }

  capitalize(brand: string): string {
    if (brand == 'american_express') {
      return brand = 'Amex';
    }
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  }

  swiperSlideChanged(e: any) {
    console.log('Changed: ', e);
  }
}
