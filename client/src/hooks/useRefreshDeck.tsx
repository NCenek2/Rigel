import { organizeData } from "../contexts/DeckContext";
import { useNavigate, useLocation } from "react-router";
import useAxiosPrivate from "./useAxiosPrivate";
import useDeck from "./useDeck";
import { ROUTE_PREFIX } from "../constants";

const useRefreshDeck = () => {
  const { setDecks } = useDeck();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const refresh = async () => {
    try {
      const [decksReponse, deckInfoReponse] = await Promise.all([
        axiosPrivate.get("/decks"),
        axiosPrivate.get("/decks/all"),
      ]);
      setDecks(organizeData(decksReponse.data, deckInfoReponse.data));
    } catch (err) {
      console.error(err);
      navigate(`${ROUTE_PREFIX}/login`, {
        state: { from: location },
        replace: true,
      });
    }
  };

  return refresh;
};

export default useRefreshDeck;
