import { Card, NewCard } from '../../edit/card/card.model';

export type Deck = {
  deck_id: number;
  deck_name: string;
  cards: Card[];
};

type DeckDataInfo = {
  deck_id: number;
  deck_name_old: string;
  deck_name: string;
};

export type useUpdateDecksProps = {
  deckData: DeckDataInfo;
  deleted: number[];
  updated: Card[];
  created: NewCard[];
};
