import React, { useState } from "react";
import { ModeEnum } from "../../contexts/ModeContext";
import useMode from "../../hooks/useMode";
import useDeckService from "../../hooks/services/useDeckService";

type DeckProps = {
  deck_id: number;
  deck_index: number;
  deck_name: string;
  cardCount: number;
};

const Deck = ({ deck_id, deck_index, deck_name, cardCount }: DeckProps) => {
  const { setMode, setCurrentDeckId } = useMode();
  const { deleteDeck } = useDeckService();
  const [deleteClicked, setDeleteClicked] = useState(false);

  const handleDeckClick = (newMode: ModeEnum) => {
    if (newMode !== ModeEnum.EDIT && cardCount < 1) return;
    setMode(newMode);
    setCurrentDeckId(deck_index);
    setDeleteClicked(false);
  };

  const handleDeleteClicked = () => {
    if (!deleteClicked) return setDeleteClicked(true);
    setDeleteClicked(false);
    deleteDeck(deck_id);
  };

  return (
    <article className="deck-container  bg-light text-black">
      <h3 className="deck-title">{deck_name.substring(0, 25)}</h3>
      <p className="deck-count">Cards: {cardCount}</p>
      <div className="deck-button-container">
        <button
          className="btn deck-btn"
          name="study"
          onClick={() => handleDeckClick(ModeEnum.STUDY)}
        >
          Study
        </button>
        <button
          className="btn deck-btn"
          name="write"
          onClick={() => handleDeckClick(ModeEnum.WRITE)}
        >
          Write
        </button>
        <button
          className="btn deck-btn"
          name="edit"
          onClick={() => handleDeckClick(ModeEnum.EDIT)}
        >
          Edit
        </button>
        <button
          className={`btn deck-btn ${deleteClicked && "deck-btn-delete"}`}
          name="delete"
          onClick={handleDeleteClicked}
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default Deck;
