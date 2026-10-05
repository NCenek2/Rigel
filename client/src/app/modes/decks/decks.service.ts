import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AlertService } from "../../alert/alert.service";
import { AuthService } from "../../auth/auth.service";
import { useAxiosPrivate } from "../../auth/axios/axios";
import { Deck, useUpdateDecksProps } from "./deck/deck.model";

@Injectable({ providedIn: "root" })
export class DecksService {
  constructor(
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  private _decks = signal<Deck[]>([]);
  decks = this._decks.asReadonly();

  currentDeck: Deck | null = null;

  async getDecks() {
    try {
      const axiosPrivate = useAxiosPrivate(this.authService.isAuthenticated());
      const response = await axiosPrivate({
        url: "/decks",
        method: "get",
      });

      const decks = response.data as Deck[];
      this._decks.set(decks ?? []);
    } catch (err) {
      this.alertService.handleError(err);
    }
  }

  async createDeck() {
    const deck_name = "New Deck";
    try {
      const axiosPrivate = useAxiosPrivate(this.authService.isAuthenticated());
      const response = await axiosPrivate({
        url: "/decks",
        method: "post",
        data: { deck_name },
      });

      if (response?.status === 201) {
        this.refresh();
      }
    } catch (err) {
      this.alertService.handleError(err);
    }
  }

  changeCurrentDeck(deck: Deck) {
    this.currentDeck = deck;
  }

  async deleteDeck(deck_id: number) {
    try {
      const axiosPrivate = useAxiosPrivate(this.authService.isAuthenticated());
      const response = await axiosPrivate({
        url: "/decks",
        method: "delete",
        data: { deck_id },
      });
      if (response?.status === 204) {
        this.refresh();
      }
    } catch (err) {
      this.alertService.handleError(err);
    }
  }

  updateDecks = async ({
    deckData,
    deleted,
    updated,
    created,
  }: useUpdateDecksProps) => {
    const axiosPrivate = useAxiosPrivate(this.authService.isAuthenticated());
    const { deck_id, deck_name, deck_name_old } = deckData;
    const changeDeckNameOptions = {
      url: "/decks",
      method: "put",
      data: { deck_id, deck_name },
    };

    const deleteDeckOptions = {
      url: "/deck",
      method: "delete",
      data: { deleted },
    };
    const updateDeckOptions = {
      url: "/deck",
      method: "put",
      data: { updated },
    };
    const createDeckOptions = {
      url: "/deck",
      method: "post",
      data: { created },
    };

    let promiseArray = [];

    if (deck_name_old !== deck_name)
      promiseArray.push(await axiosPrivate(changeDeckNameOptions));
    if (deleted.length > 0)
      promiseArray.push(await axiosPrivate(deleteDeckOptions));
    if (updated.length > 0)
      promiseArray.push(await axiosPrivate(updateDeckOptions));
    if (created.length > 0)
      promiseArray.push(await axiosPrivate(createDeckOptions));

    try {
      if (promiseArray.length === 0) return;

      await Promise.all(promiseArray);
    } catch (err) {
      this.alertService.handleError(err);
    }
  };

  public async refresh() {
    try {
      await this.getDecks();
    } catch (err) {
      this.alertService.handleError(err);
    }
  }
}
