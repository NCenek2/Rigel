const hasToken = require("../middlewares/hasToken");
require("dotenv").config();

module.exports = (pool, app) => {
  const BASE_URL = "/cards";
  pool.connect();

  app.get(`${BASE_URL}/:deck_id`, hasToken, async (req, res) => {
    const id = req.user_id;
    if (!id) return res.sendStatus(401);

    const { deck_id } = req.params;
    if (!deck_id) return res.sendStatus(400);

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
          d.user_id = $1
        AND d.deck_id = $2`;

    const result = await pool.query(query, [id, deck_id]);

    res.json(result.rows);
  });
};
