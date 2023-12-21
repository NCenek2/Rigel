const getAllCardsFromDeck = async (req, res) => {
  const { id } = req.token;
  if (!id) return res.sendStatus(401);

  const query = `SELECT
        d.deck_id,
        d.deck_name,
        c.card_id,
        c.term,
        c.definition
    FROM
        decks d
    JOIN
        cards c ON d.deck_id = c.deck_id
    WHERE
        d.user_id = $1`;

  const result = await pool.query(query, [id]);

  res.json(result.rows);
};

const readAllUserDecks = async (req, res) => {
  const { id } = req.token;
  if (!id) return res.sendStatus(401);

  const query = `SELECT * FROM decks where user_id = $1`;
  const result = await pool.query(query, [id]);

  console.log(result.rows);
  res.json(result.rows);
};

const createNewDeck = async (req, res) => {
  const { id } = req.token;
  if (!id) return res.sendStatus(401);

  const { name } = req.body;
  if (!name) return res.sendStatus(400);

  try {
    const query = `INSERT INTO decks (user_id, deck_name) VALUES ($1, $2)`;
    await pool.query(query, [id, name]);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(409);
  }
};

const updateDeckName = async (req, res) => {
  const { id } = req.token;
  if (!id) return res.sendStatus(401);

  const { deckId, name } = req.body;
  if (!deckId || !name) return res.sendStatus(400);

  const query = "UPDATE decks SET deck_name = $1 WHERE deck_id = $2";

  try {
    await pool.query(query, [name, deckId]);
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.sendStatus(409);
  }
};

const deleteDeckById = async (req, res) => {
  const { id } = req.token;
  if (!id) return res.sendStatus(401);

  const { deckId } = req.body;
  if (!deckId) return res.sendStatus(400);

  const deleteCardsQuery = "DELETE FROM cards WHERE deck_id = $1;";
  const deleteDeckQuery = "DELETE FROM decks WHERE deck_id = $1;";

  try {
    await pool.query(deleteCardsQuery, [deckId]);
    await pool.query(deleteDeckQuery, [deckId]);
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.sendStatus(409);
  }
};

module.exports = {
  getAllCardsFromDeck,
  readAllUserDecks,
  createNewDeck,
  updateDeckName,
  deleteDeckById,
};
