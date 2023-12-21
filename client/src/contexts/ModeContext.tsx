import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import useDeckContext, { Card, DeckContextType } from "./DeckContext";

export enum ModeEnum {
  STUDY,
  EDIT,
  WRITE,
}

export type ModeContextType = {
  exitSession: () => void;
  mode: ModeEnum | null;
  setMode: Dispatch<SetStateAction<ModeEnum | null>>;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  currentDeckId: number | null;
  setCurrentDeckId: Dispatch<SetStateAction<number | null>>;
};

const ModeContext = createContext<ModeContextType | null>(null);

const useModeContext = () => {
  return useContext(ModeContext);
};

export const ModeProvider = ({ children }: any) => {
  const { decks } = useDeckContext() as DeckContextType;
  const [mode, setMode] = useState<ModeEnum | null>(null);
  const [currentDeckId, setCurrentDeckId] = useState<number | null>(null);

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (currentDeckId !== null) {
      setCards(decks[currentDeckId].cards);
    }
  }, [decks, currentDeckId]);

  const exitSession = () => {
    setCurrentDeckId(null);
    setMode(null);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        currentDeckId,
        setCurrentDeckId,
        cards,
        setCards,
        exitSession,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export default useModeContext;
