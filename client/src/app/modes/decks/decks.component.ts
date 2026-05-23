import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeckComponent } from "./deck/deck.component";
import { DecksService } from "./decks.service";

@Component({
  selector: "app-decks",
  templateUrl: "./decks.component.html",
  styleUrl: "./decks.component.css",
  imports: [DeckComponent],
})
export class DecksComponent implements OnInit {
  constructor(
    private readonly decksService: DecksService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  decks = this.decksService.allDecks;

  ngOnInit(): void {
    this.decksService.refresh();
  }

  createDeck() {
    this.decksService.createDeck();
  }
}
