import { useContext } from "react";
import { UseModeContextType, ModeContext } from "../contexts/ModeContext";

const useMode = (): UseModeContextType => {
  return useContext<UseModeContextType>(ModeContext);
};

export default useMode;
