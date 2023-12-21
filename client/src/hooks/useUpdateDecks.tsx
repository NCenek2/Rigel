import { Card, NewCard } from "../contexts/DeckContext";
import useAxiosPrivate from "./useAxiosPrivate";
import useRefreshDeck from "./useRefreshDeck";

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

const useUpdateDecks = () => {
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshDeck();

  const update = async ({
    deckData,
    deleted,
    updated,
    created,
  }: useUpdateDecksProps) => {
    try {
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

      await Promise.all(promiseArray);
      refresh();
    } catch (err) {
      console.log(err);
    }
  };
  return update;
};
export default useUpdateDecks;
