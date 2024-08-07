import { Injectable, signal } from '@angular/core';
import { Card } from './edit/card/card.model';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private _cards = signal<Card[]>([]);
  cards = this._cards.asReadonly();
  
  madeChanges = signal(false);
  updatedSet = new Set<number>();
  deletedSet = new Set<number>();

  reset() {
    this.madeChanges.set(false);
    this.updatedSet = new Set<number>();
    this.deletedSet = new Set<number>();
  }

  setCards(cards: Card[]) {
    this._cards.set(cards);
  }

  updateCards(card: Card) {
    this._cards.set([...this._cards(), card]);
  }
}
