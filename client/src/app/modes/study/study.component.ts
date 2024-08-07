import { Component, inject, input, signal } from '@angular/core';
import { DecksService } from '../decks/decks.service';
import { Card } from '../edit/card/card.model';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrl: './study.component.css',
})
export class StudyComponent {
  showTerm = true;

  index = signal(0);
  cards = input.required<Card[]>();

  decksService = inject(DecksService);

  prevCard() {
    if (this.index() - 1 < 0) return;
    this.showTerm = true;
    return this.index.set(this.index() - 1);
  }

  nextCard() {
    if (this.index() + 1 >= this.cards().length) return;
    this.showTerm = true;
    return this.index.set(this.index() + 1);
  }

  handleTerm() {
    this.showTerm = !this.showTerm;
  }
}
