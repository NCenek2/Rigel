import React, { useState, useEffect } from "react";
import useMode from "../../hooks/useMode";
import { Card } from "../../contexts/DeckContext";
import { useAlert } from "../../hooks/useAlert";
const Write = () => {
  const { exitSession, cards, setCards } = useMode();
  const { setAlert } = useAlert();

  // Index keeps index of the card
  const [index, setIndex] = useState(0);
  // showDefinition toggles between term and defintion when flipped
  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  // Checks Inputed Valve to Display Button as Green or Red
  const [checkValue, setCheckValue] = useState<boolean | null>(null);
  // Holds the wrong cards after incorrect answers
  const [wrongData, setWrongData] = useState<Card[]>([]);
  // Houses incorrect definition terms
  const [wrongDataSet, setWrongDataSet] = useState(new Set<string>());

  useEffect(() => {
    const handleTab = (e: any) => {
      if (e.key === "Tab") e.preventDefault();
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  const handleCardOverwrite = () => {
    setWrongData((previousWrongData) =>
      previousWrongData.filter(
        (prevWrongValue) => prevWrongValue.term !== cards[index].term
      )
    );

    setCheckValue(true);
    setInputValue("");
    setPlaceholder(`Overwritten to ${cards[index].definition}`);
  };

  const handleInputValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setPlaceholder("Type the Definition");
    setInputValue(value);
  };

  const handleCardReset = () => {
    setInputValue("");
    setCheckValue(null);
    setPlaceholder("");
  };

  const handleNextTerm = () => {
    if (wrongData.length === 0 && index + 1 >= cards.length) {
      setAlert("You finished!", "success");
      return exitSession();
    }
    setIndex((prevIndex) => {
      if (prevIndex + 1 >= cards.length) {
        setCards(() => {
          handleCardReset();
          setWrongDataSet(new Set<string>());
          return wrongData;
        });
        setWrongData([]);
        return 0;
      }
      handleCardReset();
      return prevIndex + 1;
    });
  };

  const createSet = (str: string): Set<string> => {
    // Spliting string into lowercase array of words, taking out
    // spaces, commas, and periods.
    let matched = str.toLowerCase().split(/[.,\s]+/gi);
    if (!matched) return new Set<string>();

    let mySet = new Set<string>();
    let unWanted = new Set([
      "the",
      "an",
      "at",
      "so",
      "is",
      "are",
      "of",
      "and",
      "in",
      "there",
    ]);

    for (let item of matched) {
      if (!unWanted.has(item) && item.length > 1) mySet.add(item);
    }

    return mySet;
  };

  const handleCheck = () => {
    if (inputValue.length <= 1) return;
    const definitionSet = createSet(cards[index].definition);
    let userSet = createSet(inputValue);

    if (userSet.size < 1) return;

    setWrongData((prevWrongData) => {
      let correctGuess = true;

      const countCorrect = new Set(
        [...definitionSet].filter((item) => userSet.has(item))
      ).size;

      setInputValue("");

      // Current card properties
      const { term, definition, card_id } = cards[index];
      let message = `Yours:\n${inputValue}\nActual:\n${definition}`;

      if (countCorrect === definitionSet.size) {
        message = "Perfect\n" + message;
      } else if (countCorrect >= Math.ceil(definitionSet.size * 0.6)) {
        message = "Correct\n" + message;
      } else {
        correctGuess = false;

        if (!wrongDataSet.has(term)) {
          // Add term to wrong set after failing check
          setWrongDataSet((prevWrongDataSet) => {
            prevWrongDataSet.add(term);
            return prevWrongDataSet;
          });
          prevWrongData.push(cards[index]);
        }
      }

      if (correctGuess) {
        prevWrongData = prevWrongData.filter(
          (wrongData) => wrongData.card_id !== card_id
        );
        setWrongDataSet((prevWrongDataSet) => {
          prevWrongDataSet.delete(term);
          return prevWrongDataSet;
        });
      }

      setPlaceholder(message);
      setCheckValue(correctGuess);
      return prevWrongData;
    });
  };

  return (
    <>
      <section className="write-container">
        <button
          className="btn btn-outline-light add-deck"
          onClick={exitSession}
        >
          Home
        </button>
        <div className="write-count-term-container">
          <p className={`${index === cards.length - 1 && "last-index"}`}>
            {index + 1}/{cards.length}
          </p>
          <h3>
            {cards[index]?.term.substring(0, 49).toUpperCase().slice(0, 1) +
              cards[index]?.term.substring(0, 49).slice(1, 50)}{" "}
          </h3>
        </div>
        {checkValue !== null && (
          <button
            className="btn add-color"
            onClick={handleNextTerm}
            disabled={checkValue == null && true}
          >
            Next
          </button>
        )}
        <textarea
          value={inputValue}
          onChange={handleInputValue}
          className={`write-textarea ${
            checkValue !== null && "pointer-events"
          }`}
          placeholder={
            checkValue !== null ? `${placeholder}` : "Type the Definition"
          }
        ></textarea>
        <div className="write-btn-container">
          <button
            className={`btn ${
              checkValue === true
                ? "btn-green pointer-events"
                : checkValue === false
                ? "btn-red"
                : "btn-outline-light"
            } write-btn`}
            onClick={handleCheck}
          >
            Check
          </button>
          <button
            className={`btn btn-outline-light write-btn ${
              (checkValue === null || checkValue === true) && "pointer-events"
            }`}
            onClick={handleCardOverwrite}
            disabled={checkValue == null && true}
          >
            Overwrite
          </button>
        </div>
      </section>
    </>
  );
};

export default Write;
