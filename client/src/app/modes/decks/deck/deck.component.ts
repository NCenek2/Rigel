import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DecksService } from "../decks.service";
import { Deck } from "./deck.model";

@Component({
  selector: "app-deck",
  templateUrl: "./deck.component.html",
  styleUrl: "./deck.component.css",
  imports: [RouterLink],
})
export class DeckComponent {
  constructor(private readonly decksService: DecksService) {}

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
