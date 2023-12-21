import React, { useState } from "react";
import useModeContext, {
  ModeContextType,
  ModeEnum,
} from "../../contexts/ModeContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useRefreshDeck from "../../hooks/useRefreshDeck";
import { useNavigate } from "react-router-dom";

// { deck_id, deck_name, description, cardCount, selectDeck }

type DeckProps = {
  deck_id: number;
  deck_index: number;
  deck_name: string;
  cardCount: number;
};

const Deck = ({ deck_id, deck_index, deck_name, cardCount }: DeckProps) => {
  const { setMode, setCurrentDeckId } = useModeContext() as ModeContextType;
  const [deleteClicked, setDeleteClicked] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshDeck();
  const navigate = useNavigate();

  const handleDeckClick = (newMode: ModeEnum) => {
    if (newMode !== ModeEnum.EDIT && cardCount < 1) return;

    setMode(newMode);
    setCurrentDeckId(deck_index);
    setDeleteClicked(false);
  };

  const deleteDeck = async () => {
    try {
      await axiosPrivate({
        url: "/decks",
        method: "delete",
        data: { deck_id },
      });

      refresh();
    } catch (err) {
      console.log("ERROR");
    }
  };

  const handleDeleteClicked = () => {
    if (!deleteClicked) return setDeleteClicked(true);
    setDeleteClicked(false);
    deleteDeck();
    refresh();
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
