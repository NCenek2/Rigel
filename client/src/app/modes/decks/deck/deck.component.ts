import { Component, inject, input, Input } from '@angular/core';
import { Deck } from './deck.model';
import { DecksService } from '../decks.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css',
})
export class DeckComponent {
  decksService = inject(DecksService);

  @Input({ required: true }) deck!: Deck;

  deleteClicked = false;

  setCurrentDeck() {
    this.decksService.changeCurrentDeck(this.deck);
  }

  deleteDeck() {
    if (!this.deleteClicked) {
      this.deleteClicked = true;
      return;
    }
    this.decksService.deleteDeck(this.deck.deck_id);
  }
}
