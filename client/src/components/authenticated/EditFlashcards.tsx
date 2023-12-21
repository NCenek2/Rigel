import React, { useState } from "react";
import EditFlashcard from "./EditFlashcard";
import useDeckContext, {
  DeckContextType,
  Card,
  NewCard,
} from "../../contexts/DeckContext";
import ErrorAlert from "./ErrorAlert";
import useModeContext, { ModeContextType } from "../../contexts/ModeContext";
import useUpdateDecks from "../../hooks/useUpdateDecks";
import {
  CARD_DEFINITION_LENGTH,
  CARD_TERM_LENGTH,
  DECK_NAME_LENGTH,
} from "../../constants";

const EditFlashCards = () => {
  const { decks } = useDeckContext() as DeckContextType;
  const { currentDeckId, exitSession, cards, setCards } =
    useModeContext() as ModeContextType;
  const update = useUpdateDecks();
  const [madeChanges, setMadeChanges] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [deckTitle, setDeckTitle] = useState(
    currentDeckId !== null ? decks[currentDeckId].deck_name : ""
  );

  const [updatedSet, setUpdatedSet] = useState(new Set<number>());
  const [deletedSet, setDeletedSet] = useState(new Set<number>());

  if (currentDeckId == null) {
    return <h1>Deck Id is null</h1>;
  }

  const hasIncompleteCards = () => {
    const incompleteCards = cards.some(
      (card) => card.term.trim() === "" && card.definition.trim() === ""
    );

    if (incompleteCards) {
      setErrorMessage("Card Term and Definitions cannot be empty");
      setShowErrorMessage(true);
    }
    return incompleteCards;
  };

  const titleExceedsLength = () => {
    const exceedsLength = deckTitle.length > DECK_NAME_LENGTH;

    if (exceedsLength) {
      setErrorMessage(`Deck name cannot exceed ${DECK_NAME_LENGTH} characters`);
      setShowErrorMessage(true);
    }

    return exceedsLength;
  };

  const termOrDefinitionExceedsLength = () => {
    let cardLengthExceeded = false;

    for (let card of cards) {
      if (card.term.length > CARD_TERM_LENGTH) {
        cardLengthExceeded = true;
        setErrorMessage(
          `Card with term '${card.term}' exceeds the term length of ${CARD_TERM_LENGTH} `
        );
        break;
      }

      if (card.definition.length > CARD_DEFINITION_LENGTH) {
        cardLengthExceeded = true;
        setErrorMessage(
          `Card with term '${card.term}' exceeds the defintion length of ${CARD_DEFINITION_LENGTH} `
        );
        break;
      }
    }

    if (cardLengthExceeded) setShowErrorMessage(true);
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

  const handleUpdate = () => {
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
    update({ deckData, deleted, updated, created });
    setMadeChanges(false);
    setShowErrorMessage(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMadeChanges(true);
    setDeckTitle((prevTitle) => e.target.value);
  };

  return (
    <section className="edit-flashcards-section">
      <button className="btn btn-outline-light add-deck" onClick={exitSession}>
        Home
      </button>
      {showErrorMessage && (
        <ErrorAlert
          errorMessage={errorMessage}
          setShowErrorMessage={setShowErrorMessage}
        />
      )}
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
              setCards={setCards}
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
