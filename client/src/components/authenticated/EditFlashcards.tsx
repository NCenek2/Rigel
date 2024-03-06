import React, { useState } from "react";
import EditFlashcard from "./EditFlashcard";
import {
  CARD_DEFINITION_LENGTH,
  CARD_TERM_LENGTH,
  DECK_NAME_LENGTH,
} from "../../constants";
import useMode from "../../hooks/useMode";
import useDeck from "../../hooks/useDeck";
import { Card, NewCard } from "../../contexts/DeckContext";
import useDeckService from "../../hooks/services/useDeckService";
import { useAlert } from "../../hooks/useAlert";

const EditFlashCards = () => {
  const { decks } = useDeck();
  const { currentDeckId, exitSession, cards, setCards } = useMode();
  const { updateDecks } = useDeckService();
  const [madeChanges, setMadeChanges] = useState(false);
  const { setAlert } = useAlert();

  const [deckTitle, setDeckTitle] = useState(
    currentDeckId !== null ? decks[currentDeckId].deck_name : ""
  );

  const [updatedSet, setUpdatedSet] = useState<Set<number>>(new Set<number>());
  const [deletedSet, setDeletedSet] = useState<Set<number>>(new Set<number>());

  if (currentDeckId == null) {
    return <h1>Deck Id is null</h1>;
  }

  const hasIncompleteCards = () => {
    const incompleteCards = cards.some(
      (card) => card.term.trim() === "" && card.definition.trim() === ""
    );

    if (incompleteCards) {
      setAlert("Card Term and Definitions cannot be empty");
    }
    return incompleteCards;
  };

  const titleExceedsLength = () => {
    const exceedsLength = deckTitle.length > DECK_NAME_LENGTH;

    if (exceedsLength) {
      setAlert(`Deck name cannot exceed ${DECK_NAME_LENGTH} characters`);
    }

    return exceedsLength;
  };

  const termOrDefinitionExceedsLength = () => {
    let cardLengthExceeded = false;

    for (let card of cards) {
      if (card.term.length > CARD_TERM_LENGTH) {
        cardLengthExceeded = true;
        setAlert(
          `Card with term '${card.term}' exceeds the term length of ${CARD_TERM_LENGTH} `
        );
        break;
      }

      if (card.definition.length > CARD_DEFINITION_LENGTH) {
        cardLengthExceeded = true;
        setAlert(
          `Card with term '${card.term}' exceeds the defintion length of ${CARD_DEFINITION_LENGTH} `
        );
        break;
      }
    }

    return cardLengthExceeded;
  };

  const handleAdd = () => {
    if (hasIncompleteCards()) return;
    let newCard: Card = {
      card_id: -1,
      term: "",
      definition: "",
    };

    // For cases where we are patching from deleted cards
    if (deletedSet.size > 0) {
      for (let item of deletedSet) {
        updatedSet.add(item);
        deletedSet.delete(item);
        newCard.card_id = item;
        break;
      }
    }

    setMadeChanges(true);
    setCards((prev) => [...prev, newCard]);
  };

  const handleUpdate = async () => {
    if (
      hasIncompleteCards() ||
      titleExceedsLength() ||
      termOrDefinitionExceedsLength()
    )
      return;

    let created: NewCard[] = [];
    let updated: Card[] = [];
    let deleted: number[] = Array.from(deletedSet);

    const deck_id = decks[currentDeckId].deck_id;
    const deck_name_old = decks[currentDeckId].deck_name;

    for (let card of cards) {
      if (card.card_id === -1) {
        created.push({
          deck_id,
          term: card.term,
          definition: card.definition,
        });
      } else if (updatedSet.has(card.card_id)) {
        updated.push(card);
      }
    }

    const deckData = { deck_id, deck_name: deckTitle, deck_name_old };
    await updateDecks({ deckData, deleted, updated, created });
    setMadeChanges(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMadeChanges(true);
    setDeckTitle(e.target.value);
  };

  return (
    <section className="edit-flashcards-section">
      <button className="btn btn-outline-light add-deck" onClick={exitSession}>
        Home
      </button>
      {madeChanges && (
        <button className="btn add-color update-btn" onClick={handleUpdate}>
          Update
        </button>
      )}
      <input
        className="edit-flashcards-title"
        value={deckTitle}
        spellCheck="false"
        onChange={handleChange}
        maxLength={DECK_NAME_LENGTH}
      />
      <div
        className={`${
          cards.length === 1
            ? "edit-flashcards-container-single"
            : "edit-flashcards-container"
        }`}
      >
        {cards.map((currentCard, index) => {
          const { card_id, term, definition } = currentCard;
          return (
            <EditFlashcard
              key={index}
              card_id={card_id}
              card_index={index}
              setMadeChanges={setMadeChanges}
              setDeletedSet={setDeletedSet}
              updatedSet={updatedSet}
              setUpdatedSet={setUpdatedSet}
              term={term}
              definition={definition}
            />
          );
        })}
      </div>
      <button className="btn add-color add-deck" onClick={handleAdd}>
        Add
      </button>
    </section>
  );
};

export default EditFlashCards;
