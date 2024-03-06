import React, { useState } from "react";
import useMode from "../../hooks/useMode";

const StudyCards = () => {
  const { exitSession, cards } = useMode();
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
      <>
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
      </>
    </section>
  );
};

export default StudyCards;
