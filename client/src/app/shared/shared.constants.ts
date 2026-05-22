import { environment } from "../../environments/environment";

export const CARD = {
  CARD_TERM_LENGTH: 30,
  CARD_DEFINITION_LENGTH: 150,
};

export const PASSWORD = {
  PASSWORD_MIN_LENGTH: 10,
};

export const DECK = {
  DECK_NAME_LENGTH: 25,
  DECK_MIN_LENGTH: 10,
};

export const ROUTE = {
  BASE_URL: environment.apiUrl,
  ROUTE_PREFIX: "",
};

export const EMAIL = {
  EMAIL_MAX_LENGTH: 35,
};
