import { Deck } from './deck/deck.model';

type ViewDecksResponse = {
  user_id: number;
  deck_id: number;
  deck_name: string;
};

type AllDeckInfoResponse = {
  deck_id: number;
  deck_name: string;
  card_id: number;
  term: string;
  definition: string;
};

export const organizeDecks = (
  deckNames: ViewDecksResponse[],
  deckInfo: AllDeckInfoResponse[]
): Deck[] => {
  let temp: any = {};
  for (let deck of deckNames) {
    const { deck_id, deck_name } = deck;
    temp[deck_id] = {
      deck_name,
      cards: [],
    };
  }

  for (let card of deckInfo) {
    const { deck_id, card_id, term, definition } = card;
    temp[deck_id].cards.push({
      card_id,
      term,
      definition,
    });
  }

  let output: Deck[] = [];

  for (let id in temp) {
    output.push({
      deck_id: Number(id),
      deck_name: temp[id].deck_name,
      cards: temp[id].cards,
    });
  }

  return output;
};
