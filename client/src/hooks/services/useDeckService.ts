import { Card, NewCard } from "../../contexts/DeckContext";
import useAxiosPrivate from "../useAxiosPrivate";
import useHandleError from "../useHandleError";
import useRefreshDeck from "../useRefreshDeck";

type DeckDataInfo = {
  deck_id: number;
  deck_name_old: string;
  deck_name: string;
};

type useUpdateDecksProps = {
  deckData: DeckDataInfo;
  deleted: number[];
  updated: Card[];
  created: NewCard[];
};

const useDeckService = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const refresh = useRefreshDeck();

  const addDeck = async () => {
    const deck_name = "New Deck";
    try {
      const response = await axiosPrivate({
        url: "/decks",
        method: "post",
        data: { deck_name },
      });
      if (response?.status === 201) {
        refresh();
      }
    } catch (err) {
      handleError(err);
    }
  };
  const updateDecks = async ({
    deckData,
    deleted,
    updated,
    created,
  }: useUpdateDecksProps) => {
    const { deck_id, deck_name, deck_name_old } = deckData;
    const changeDeckNameOptions = {
      url: "/decks",
      method: "put",
      data: { deck_id, deck_name },
    };

    const deleteDeckOptions = {
      url: "/deck",
      method: "delete",
      data: { deleted },
    };
    const updateDeckOptions = {
      url: "/deck",
      method: "put",
      data: { updated },
    };
    const createDeckOptions = {
      url: "/deck",
      method: "post",
      data: { created },
    };

    let promiseArray = [];

    if (deck_name_old !== deck_name)
      promiseArray.push(await axiosPrivate(changeDeckNameOptions));
    if (deleted.length > 0)
      promiseArray.push(await axiosPrivate(deleteDeckOptions));
    if (updated.length > 0)
      promiseArray.push(await axiosPrivate(updateDeckOptions));
    if (created.length > 0)
      promiseArray.push(await axiosPrivate(createDeckOptions));

    try {
      if (promiseArray.length === 0) return;

      const response = await Promise.all(promiseArray);
      console.log(response);
      if (
        response[0]?.status === 200 ||
        response[0]?.status === 201 ||
        response[0]?.status === 204
      ) {
        refresh();
      }
    } catch (err) {
      handleError(err);
    }
  };

  const deleteDeck = async (deck_id: number) => {
    try {
      const response = await axiosPrivate({
        url: "/decks",
        method: "delete",
        data: { deck_id },
      });
      if (response?.status === 204) {
        refresh();
      }
    } catch (err) {
      handleError(err);
    }
  };

  return { addDeck, deleteDeck, updateDecks };
};

export default useDeckService;
