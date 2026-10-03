import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DecksService } from "../decks/decks.service";

@Component({
  selector: "app-study",
  templateUrl: "./study.component.html",
  styleUrl: "./study.component.css",
  imports: [RouterLink],
})
export class StudyComponent {
  showTerm = true;

  constructor(private readonly decksService: DecksService) {}

  index = signal(0);
  cards = this.decksService.currentDeck?.cards ?? [];

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
