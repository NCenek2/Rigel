CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE decks (
  deck_id SERIAL PRIMARY KEY,
  deck_name TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE cards (
  card_id SERIAL PRIMARY KEY,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  deck_id INTEGER NOT NULL,
  FOREIGN KEY (deck_id) REFERENCES decks(deck_id)
);
