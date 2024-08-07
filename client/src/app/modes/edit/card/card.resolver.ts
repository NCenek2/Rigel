import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Card } from './card.model';
import { inject } from '@angular/core';
import { DecksService } from '../../decks/decks.service';

export const resolveCards: ResolveFn<Card[]> = (
  activatedRouteSnapshot: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
) => {
  const decksService = inject(DecksService);

  return decksService.currentDeck?.cards ?? [];
};
