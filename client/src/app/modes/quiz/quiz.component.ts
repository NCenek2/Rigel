import { Component, inject, input, OnInit } from '@angular/core';
import { DecksService } from '../decks/decks.service';
import { AlertService } from '../../alert/alert.service';
import { Card } from '../edit/card/card.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  checkValue: boolean | null = null;
  wrongData: Card[] = [];
  wrongDataSet = new Set<string>();

  index = 0;
  placeholder = '';
  answer = '';

  cardsService = inject(CardsService);
  decksService = inject(DecksService);
  alertService = inject(AlertService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  cards = this.cardsService.cards;

  ngOnInit() {
    this.cardsService.setCards(this.decksService.currentDeck?.cards ?? []);
  }

  nextTerm() {
    if (this.wrongData.length === 0 && this.index + 1 >= this.cards().length) {
      this.alertService.setAlert('You finished!', 'success');
      this.router.navigate(['../'], {
        relativeTo: this.activatedRoute,
      });
      return;
    }

    if (this.index + 1 >= this.cards().length) {
      this.cardReset();
      this.wrongDataSet = new Set<string>();
      this.cardsService.setCards(this.wrongData);
      this.wrongData = [];
      this.index = 0;
      return;
    }

    this.cardReset();
    this.index = this.index + 1;
  }

  private cardReset() {
    this.answer = '';
    this.checkValue = null;
    this.placeholder = '';
  }

  overwrite() {
    this.wrongData = this.wrongData.filter(
      (prevWrongValue) =>
        prevWrongValue.card_id !== this.cards()[this.index].card_id
    );

    this.checkValue = true;
    this.answer = '';
    this.placeholder = `Overwritten to ${this.cards()[this.index].definition}`;
  }

  private createSet(str: string): Set<string> {
    // Spliting string into lowercase array of words, taking out
    // spaces, commas, and periods.
    let matched = str.toLowerCase().split(/[.,\s]+/gi);
    if (!matched) return new Set<string>();

    let mySet = new Set<string>();
    let unWanted = new Set([
      'the',
      'an',
      'at',
      'so',
      'is',
      'are',
      'of',
      'and',
      'in',
      'there',
    ]);

    for (let item of matched) {
      if (!unWanted.has(item) && item.length > 1) mySet.add(item);
    }

    return mySet;
  }

  check() {
    if (this.answer.length <= 1) return;
    const definitionSet = this.createSet(this.cards()[this.index].definition);
    let userSet = this.createSet(this.answer);

    if (userSet.size < 1) return;

    let correctGuess = true;

    const countCorrect = new Set(
      [...definitionSet].filter((item) => userSet.has(item))
    ).size;

    // Current card properties
    const { term, definition, card_id } = this.cards()[this.index];
    let message = `Yours:\n${this.answer}\nActual:\n${definition}`;

    if (countCorrect === definitionSet.size) {
      message = 'Perfect\n' + message;
    } else if (countCorrect >= Math.ceil(definitionSet.size * 0.6)) {
      message = 'Correct\n' + message;
    } else {
      correctGuess = false;

      if (!this.wrongDataSet.has(term)) {
        // Add term to wrong set after failing check
        this.wrongDataSet.add(term);
        this.wrongData.push(this.cards()[this.index]);
      }
    }

    if (correctGuess) {
      this.wrongData = this.wrongData.filter(
        (wrongData) => wrongData.card_id !== card_id
      );
      this.wrongDataSet.delete(term);
    }

    this.answer = '';
    this.placeholder = message;
    this.checkValue = correctGuess;
  }
}
