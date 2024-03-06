import React from "react";
import { DeckProvider } from "../../contexts/DeckContext";
import MainSwitch from "./MainSwitch";
import { ModeProvider } from "../../contexts/ModeContext";

const Main = () => {
  return (
    <DeckProvider>
      <ModeProvider>
        <MainSwitch />
      </ModeProvider>
    </DeckProvider>
  );
};

export default Main;
