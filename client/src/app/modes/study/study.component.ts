import { Component, OnInit, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CardsService } from "../cards.service";
import { DecksService } from "../decks/decks.service";

@Component({
  selector: "app-study",
  templateUrl: "./study.component.html",
  styleUrl: "./study.component.css",
  imports: [RouterLink],
})
export class StudyComponent implements OnInit {
  showTerm = true;

  constructor(
    private readonly decksService: DecksService,
    private readonly router: Router,
    private readonly cardsService: CardsService,
  ) {}

  ngOnInit(): void {
    const currentDeckId = this.decksService.currentDeck;
    if (!currentDeckId) {
      this.router.navigate(["/decks"]);
      return;
    }

    this.cardsService.getDeckCards(currentDeckId.deck_id);
  }

  index = signal(0);
  cards = this.cardsService.cards;

  prevCard() {
    if (this.index() - 1 < 0) return;
    this.showTerm = true;
    return this.index.set(this.index() - 1);
  }

  nextCard() {
    if (this.index() + 1 >= this.cards.length) return;
    this.showTerm = true;
    return this.index.set(this.index() + 1);
  }

  handleTerm() {
    this.showTerm = !this.showTerm;
  }
}
