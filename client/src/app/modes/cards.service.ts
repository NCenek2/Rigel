import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AlertService } from "../alert/alert.service";
import { AuthService } from "../auth/auth.service";
import { useAxiosPrivate } from "../auth/axios/axios";
import { Card } from "./edit/card/card.model";

@Injectable({ providedIn: "root" })
export class CardsService {
  constructor(
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  private _cards = signal<Card[]>([]);
  cards = this._cards.asReadonly();

  madeChanges = signal(false);
  updatedSet = new Set<number>();
  deletedSet = new Set<number>();

  async getDeckCards(deck_id: number) {
    try {
      const axiosPrivate = useAxiosPrivate(this.authService.isAuthenticated());
      const response = await axiosPrivate({
        url: `/cards/${deck_id}`,
        method: "get",
      });

      const cards = response.data as Card[];
      this._cards.set(cards ?? []);
    } catch (err) {
      this.alertService.handleError(err);
    }
  }

  reset() {
    this.madeChanges.set(false);
    this.updatedSet = new Set<number>();
    this.deletedSet = new Set<number>();
  }

  setCards(cards: Card[]) {
    this._cards.set(cards);
  }

  updateCards(card: Card) {
    this._cards.set([...this._cards(), card]);
  }
}
