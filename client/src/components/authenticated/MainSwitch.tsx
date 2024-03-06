import React from "react";
import StudyCards from "./StudyCards";
import Decks from "./Decks";
import Write from "./Write";
import { ModeEnum } from "../../contexts/ModeContext";
import EditFlashCards from "./EditFlashcards";
import useMode from "../../hooks/useMode";

const MainSwitch = () => {
  const { mode } = useMode();

  return (
    <main className="quizlet-container">
      {mode === ModeEnum.EDIT ? (
        <EditFlashCards />
      ) : mode === ModeEnum.WRITE ? (
        <Write />
      ) : mode === ModeEnum.STUDY ? (
        <StudyCards />
      ) : (
        <Decks />
      )}
    </main>
  );
};

export default MainSwitch;

// {
//   editSelected ? (
//     <EditFlashCards />
//   ) : studySelected ? (
//     <StudyCards />
//   ) : quizSelected ? (
//     <Write />
//   ) : (
//     <Decks />
//   );
// }
