import { Component, inject, OnInit } from '@angular/core';
import { DecksService } from './decks.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrl: './decks.component.css',
})
export class DecksComponent implements OnInit {
  decksService = inject(DecksService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  decks = this.decksService.allDecks;

  ngOnInit(): void {
    this.decksService.refresh();
  }

  createDeck() {
    this.decksService.createDeck();
  }
}
