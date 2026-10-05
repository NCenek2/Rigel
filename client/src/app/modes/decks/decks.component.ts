import { Component, OnInit } from "@angular/core";
import { DeckComponent } from "./deck/deck.component";
import { DecksService } from "./decks.service";

@Component({
  selector: "app-decks",
  templateUrl: "./decks.component.html",
  styleUrl: "./decks.component.css",
  imports: [DeckComponent],
})
export class DecksComponent implements OnInit {
  constructor(private readonly decksService: DecksService) {}

  decks = this.decksService.decks;

  ngOnInit(): void {
    this.decksService.getDecks();
  }

  createDeck() {
    this.decksService.createDeck();
  }
}
