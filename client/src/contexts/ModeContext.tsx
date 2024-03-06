import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  ReactNode,
} from "react";
import React from "react";
import { Card } from "./DeckContext";
import useDeck from "../hooks/useDeck";

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

const useModeContext = () => {
  const { decks } = useDeck();
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

  return {
    mode,
    setMode,
    currentDeckId,
    setCurrentDeckId,
    cards,
    setCards,
    exitSession,
  };
};

export type UseModeContextType = ReturnType<typeof useModeContext>;

const useModeContextType: UseModeContextType = {
  mode: null,
  setMode: () => {},
  currentDeckId: null,
  setCurrentDeckId: () => {},
  cards: [],
  setCards: () => {},
  exitSession: () => {},
};

export const ModeContext =
  createContext<UseModeContextType>(useModeContextType);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const ModeProvider = ({ children }: ChildrenType) => {
  return (
    <ModeContext.Provider value={useModeContext()}>
      {children}
    </ModeContext.Provider>
  );
};

export default useModeContext;
