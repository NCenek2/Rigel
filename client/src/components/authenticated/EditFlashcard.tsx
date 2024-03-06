import React, { Dispatch, SetStateAction } from "react";
import { Card } from "../../contexts/DeckContext";
import { CARD_DEFINITION_LENGTH, CARD_TERM_LENGTH } from "../../constants";
import useMode from "../../hooks/useMode";

type EditFlashCardProps = {
  setMadeChanges: Dispatch<SetStateAction<boolean>>;
  card_index: number;
  setDeletedSet: Dispatch<SetStateAction<Set<number>>>;
  updatedSet: Set<number>;
  setUpdatedSet: Dispatch<SetStateAction<Set<number>>>;
};

const EditFlashcard = ({
  card_id,
  term,
  definition,
  card_index,
  setDeletedSet,
  updatedSet,
  setUpdatedSet,
  setMadeChanges,
}: Card & EditFlashCardProps) => {
  const { setCards } = useMode();
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMadeChanges(true);

    if (card_id !== -1 && !updatedSet.has(card_id)) {
      setUpdatedSet((prevUpdatedSet: Set<number>) => {
        prevUpdatedSet.add(card_id);
        return prevUpdatedSet;
      });
    }

    const { id, value } = e.target;

    setCards((prevCards) => {
      const newCards: Card[] = [...prevCards];
      newCards[card_index][id] = value;
      return [...newCards];
    });
  };

  const handleDelete = () => {
    setMadeChanges(true);
    // For cases where we are not using an existing id
    if (card_id === -1) {
      setCards((prevCards) =>
        prevCards.filter((_, index) => index !== card_index)
      );
    } else {
      // For Cases where we are deleting a card with an id
      setCards((prevCards) =>
        prevCards.filter((card) => card.card_id !== card_id)
      );

      if (updatedSet.has(card_id)) {
        // Removes those that are updated to allow for an
        // easier distribution when i send the data to
        // server.
        setUpdatedSet((prevUpdatedSet: Set<number>) => {
          prevUpdatedSet.delete(card_id);
          return prevUpdatedSet;
        });
      }

      setDeletedSet((prevSet: Set<number>) => {
        prevSet.add(card_id);
        return prevSet;
      });
    }
  };

  return (
    <article className="card edit-flashcard-container">
      <label htmlFor="term">Term: </label>
      <input
        id="term"
        value={term}
        onChange={handleChange}
        className="quizlet-inputs"
        maxLength={CARD_TERM_LENGTH}
      />
      <br />
      <label htmlFor="definition">Definition: </label>
      <textarea
        id="definition"
        className="edit-flashcard-definition quizlet-inputs"
        value={definition}
        onChange={handleChange}
        maxLength={CARD_DEFINITION_LENGTH}
      ></textarea>
      <br />
      <button className="btn btn-red" onClick={handleDelete}>
        Delete
      </button>
    </article>
  );
};

export default EditFlashcard;
