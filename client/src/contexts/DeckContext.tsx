import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useNavigate, useLocation } from "react-router";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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

export type Card = { card_id: number; term: string; definition: string };

export type NewCard = {
  deck_id: number;
  term: string;
  definition: string;
};

export type DeckData = {
  deck_id: number;
  deck_name: string;
  cards: Card[];
};

export type DeckContextType = {
  decks: DeckData[];
  setDecks: Dispatch<SetStateAction<DeckData[]>>;
};

export const organizeData = (
  deckNames: ViewDecksResponse[],
  deckInfo: AllDeckInfoResponse[]
): DeckData[] => {
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

  let output: DeckData[] = [];

  for (let id in temp) {
    output.push({
      deck_id: Number(id),
      deck_name: temp[id].deck_name,
      cards: temp[id].cards,
    });
  }

  return output;
};

const DeckContext = createContext<DeckContextType | null>(null);

const useDeckContext = () => {
  return useContext(DeckContext);
};

export const CardProvider = ({ children }: any) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [decks, setDecks] = useState<DeckData[]>([]);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        const [decksReponse, deckInfoReponse] = await Promise.all([
          axiosPrivate.get("/decks"),
          axiosPrivate.get("/decks/all"),
        ]);

        setDecks(organizeData(decksReponse.data, deckInfoReponse.data));
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    refresh();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DeckContext.Provider value={{ decks, setDecks }}>
      {children}
    </DeckContext.Provider>
  );
};

export default useDeckContext;
