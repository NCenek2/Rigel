import React, { useState } from "react";
import useModeContext, { ModeContextType } from "../../contexts/ModeContext";

const StudyCards = () => {
  const { exitSession, cards } = useModeContext() as ModeContextType;
  const [showTerm, setShowTerm] = useState(true);
  const [index, setIndex] = useState(0);

  const prevCard = () => {
    setIndex((prevIndex) => {
      if (prevIndex - 1 < 0) return prevIndex;
      return prevIndex - 1;
    });
    setShowTerm(true);
  };

  const nextCard = () => {
    setIndex((prevIndex) => {
      if (prevIndex + 1 >= cards.length) return prevIndex;
      return prevIndex + 1;
    });
    setShowTerm(true);
  };

  const handleTerm = () => {
    setShowTerm((p) => !p);
  };

  return (
    <section className="studycards-container">
      <button className="btn btn-outline-light add-deck" onClick={exitSession}>
        Home
      </button>
      <React.Fragment>
        <article
          className="card bg-light text-black studycard-container"
          onClick={handleTerm}
        >
          <p>
            Card: {index + 1}/{cards.length}
          </p>
          {showTerm ? (
            <h2>{cards[index]?.term}</h2>
          ) : (
            <p>{cards[index]?.definition}</p>
          )}
        </article>
        <div className="studycards-buttons-container">
          <button
            className="studycards-button btn btn-outline-light"
            onClick={prevCard}
          >
            Prev
          </button>
          <button
            className="studycards-button btn btn-outline-light"
            onClick={nextCard}
          >
            Next
          </button>
        </div>
      </React.Fragment>
    </section>
  );
};

export default StudyCards;
