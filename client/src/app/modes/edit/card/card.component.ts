import { Component, inject, Input, input, OnInit } from '@angular/core';
import { DecksService } from '../../decks/decks.service';
import { CARD } from '../../../shared/shared.constants';
import { CardsService } from '../../cards.service';
import { Card } from './card.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  decksService = inject(DecksService);
  cardsService = inject(CardsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  card_index = input.required<number>();
  card = input.required<Card>();

  cardTermLength = CARD.CARD_TERM_LENGTH;
  cardDefinitionLength = CARD.CARD_DEFINITION_LENGTH;
  term = '';
  definition = '';

  ngOnInit(): void {
    this.term = this.card().term;
    this.definition = this.card().definition;
  }

  handleChange(e: any) {
    let { card_id } = this.card();
    this.cardsService.madeChanges.set(true);
    if (card_id !== -1 && !this.cardsService.updatedSet.has(card_id)) {
      this.cardsService.updatedSet.add(card_id);
    }
    const { id, value } = e.target;
    let newCards = this.cardsService.cards();

    newCards[this.card_index()][id] = value;
    this.cardsService.setCards(newCards);
  }

  handleDelete() {
    let { card_id } = this.card();
    this.cardsService.madeChanges.set(true);
    // For cases where we are not using an existing id
    if (card_id === -1) {
      const newCards = this.cardsService
        .cards()
        .filter((_, index) => index !== this.card_index());
      this.cardsService.setCards(newCards);
    } else {
      // For Cases where we are deleting a card with an id
      const newCards = this.cardsService
        .cards()
        .filter((card) => card.card_id !== card_id);
      this.cardsService.setCards(newCards);

      if (this.cardsService.updatedSet.has(card_id)) {
        // Removes those that are updated to allow for an
        // easier distribution when i send the data to
        // server.

        this.cardsService.updatedSet.delete(card_id);
      }

      this.cardsService.deletedSet.add(card_id);
    }

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      onSameUrlNavigation: 'reload',
    });
  }
}
