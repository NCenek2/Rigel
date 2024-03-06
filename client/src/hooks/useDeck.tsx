import { UseDeckContextType, DeckContext } from "../contexts/DeckContext";
import { useContext } from "react";

const useDeck = () => {
  return useContext<UseDeckContextType>(DeckContext);
};

export default useDeck;
