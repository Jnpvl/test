import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent  implements OnInit {
  @Input() cards: Card[] = [];
  @Input() selectable: boolean = false;
  @Output() cardSelected = new EventEmitter<Card>();

  selectedCardId: string | null = null;

  constructor() { }

  ngOnInit() {}

  handleSelectedCard(card: Card) {
    if (this.selectable) {
      this.selectedCardId = this.selectedCardId === card.id ? null : card.id;
      this.cardSelected.emit(card);
    } else {
      throw new Error('Error Trying to select Card');
    }
  }

  isCardSelected(card: Card): boolean {
    return this.selectedCardId === card.id;
  }

  capitalize(text: string): string {
    if (text == 'american_express') {
      return text = 'Amex';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
