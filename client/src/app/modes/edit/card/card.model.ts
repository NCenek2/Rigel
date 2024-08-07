export type Card = {
  [key: string]: any;
  card_id: number;
  term: string;
  definition: string;
};

export type NewCard = {
  deck_id: number;
  term: string;
  definition: string;
};
