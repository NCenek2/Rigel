import { inject, Injectable, signal } from '@angular/core';
import { Deck, useUpdateDecksProps } from './deck/deck.model';
import { useAxiosPrivate } from '../../auth/axios/axios';
import { AlertService } from '../../alert/alert.service';
import { organizeDecks } from './decks.helper';
import { Router } from '@angular/router';
import { ROUTE } from '../../shared/shared.constants';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DecksService {
  private alertService = inject(AlertService);
  private router = inject(Router);
  private authService = inject(AuthService);

  private decks = signal<Deck[]>([]);
  allDecks = this.decks.asReadonly();

  currentDeck: Deck | null = null;

  async createDeck() {
    const deck_name = 'New Deck';
    try {
      const axiosPrivate = useAxiosPrivate(this.authService.isAuthenticated());
      const response = await axiosPrivate({
        url: '/decks',
        method: 'post',
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
        url: '/decks',
        method: 'delete',
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
      url: '/decks',
      method: 'put',
      data: { deck_id, deck_name },
    };

    const deleteDeckOptions = {
      url: '/deck',
      method: 'delete',
      data: { deleted },
    };
    const updateDeckOptions = {
      url: '/deck',
      method: 'put',
      data: { updated },
    };
    const createDeckOptions = {
      url: '/deck',
      method: 'post',
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

      const response = await Promise.all(promiseArray);
      if (
        response[0]?.status === 200 ||
        response[0]?.status === 201 ||
        response[0]?.status === 204
      ) {
        this.refresh();
      }
    } catch (err) {
      this.alertService.handleError(err);
    }
  };

  public async refresh() {
    try {
      const axiosPrivate = useAxiosPrivate(this.authService.isAuthenticated());
      const [decksReponse, deckInfoReponse] = await Promise.all([
        axiosPrivate.get('/decks'),
        axiosPrivate.get('/decks/all'),
      ]);
      this.decks.set(organizeDecks(decksReponse.data, deckInfoReponse.data));
    } catch (err) {
      this.alertService.handleError(err);
      this.router.navigate([`${ROUTE.ROUTE_PREFIX}/login`], {
        replaceUrl: true,
      });
    }
  }
}
