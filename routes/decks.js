const hasToken = require("../middlewares/hasToken");
require("dotenv").config();

module.exports = (pool, app) => {
  const BASE_URL = "/decks";
  pool.connect();

  // READ ALL Data for user
  app.get(`${BASE_URL}/all`, hasToken, async (req, res) => {
    const id = req.user_id;
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
  });

  // READ Decks
  app.get(BASE_URL, hasToken, async (req, res) => {
    const id = req.user_id;
    if (!id) return res.sendStatus(401);

    const query = `SELECT * FROM decks where user_id = $1`;
    const result = await pool.query(query, [id]);

    // console.log(result.rows);
    res.json(result.rows);
  });

  // CREATE Decks
  app.post(BASE_URL, hasToken, async (req, res) => {
    const user_id = req.user_id;
    if (!user_id) return res.sendStatus(401);

    const { deck_name } = req.body;
    if (!deck_name) return res.sendStatus(400);


    try {
      const query = `INSERT INTO decks (user_id, deck_name) VALUES ($1, $2)`;
      await pool.query(query, [user_id, deck_name]);
      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.sendStatus(409);
    }
  });

  // UPDATE Deck Name
  app.put(BASE_URL, hasToken, async (req, res) => {
    const id = req.user_id;
    if (!id) return res.sendStatus(401);

    const { deck_id, deck_name } = req.body;
    if (!deck_id || !deck_name) return res.sendStatus(400);

    const query = "UPDATE decks SET deck_name = $1 WHERE deck_id = $2";

    try {
      await pool.query(query, [deck_name, deck_id]);
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.sendStatus(409);
    }
  });

  // DELETE Deck
  app.delete(BASE_URL, hasToken, async (req, res) => {
    const id = req.user_id;
    if (!id) return res.sendStatus(401);

    const { deck_id } = req.body;
    if (!deck_id) return res.sendStatus(400);

    const deleteCardsQuery = "DELETE FROM cards WHERE deck_id = $1;";
    const deleteDeckQuery = "DELETE FROM decks WHERE deck_id = $1;";

    try {
      await pool.query(deleteCardsQuery, [deck_id]);
      await pool.query(deleteDeckQuery, [deck_id]);
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.sendStatus(409);
    }
  });
};
