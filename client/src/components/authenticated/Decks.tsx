import React, { useState } from "react";
import Deck from "./Deck";
import useDeckContext, {
  DeckContextType,
  DeckData,
} from "../../contexts/DeckContext";
import { DECK_NAME_LENGTH } from "../../constants";
import { axiosPrivate } from "../../api/axios";
import useRefreshDeck from "../../hooks/useRefreshDeck";
const Decks = () => {
  const { decks } = useDeckContext() as DeckContextType;
  const refresh = useRefreshDeck();

  const [showError, setShowError] = useState(false);
  const [errorMessage, SetErrorMessage] = useState("");

  const handleDeckCreation = async () => {
    const newDeckName = `Deck ${decks.length + 1}`;

    try {
      const response = await axiosPrivate({
        url: "/decks",
        method: "post",
        data: { deck_name: newDeckName },
      });
      if (response?.status === 201) {
        setShowError(false);
        refresh();
      }
    } catch (err: any) {
      SetErrorMessage(err?.message);
    }
  };

  return (
    <section className="decks-container">
      {decks.length > 0 ? (
        decks.map((deck: DeckData, deck_index) => {
          const { deck_id, deck_name, cards } = deck;
          return (
            <Deck
              key={deck_id}
              deck_index={deck_index}
              deck_id={deck_id}
              deck_name={deck_name}
              cardCount={cards?.length !== null ? cards.length : 0}
            />
          );
        })
      ) : (
        <h1 className="text-white text-center no-decks">No Decks</h1>
      )}

      {decks.length < 5 && (
        <button
          type="button"
          className="btn btn-dark add-color add-deck pos-rel"
          onClick={handleDeckCreation}
        >
          Add Deck
        </button>
      )}
    </section>
  );
};

export default Decks;
