const hasToken = require("../middlewares/hasToken");
require("dotenv").config();

module.exports = (pool, app) => {
  const BASE_URL = "/deck";
  pool.connect();

  // READ Cards
  app.get(BASE_URL, hasToken, async (req, res) => {
    const id = req.user_id;
    if (!id) return res.sendStatus(401);

    const { deck_id } = req.body;

    const query = `SELECT * FROM cards where deck_id = $1`;
    const result = await pool.query(query, [deck_id]);

    res.json(result.rows);
  });

  // CREATE Card
  app.post(BASE_URL, hasToken, async (req, res) => {
    const id = req.user_id;
    if (!id) return res.sendStatus(401);

    const { created } = req.body;
    if (!created.length) return res.sendStatus(200);

    let index = 1;
    let query = "INSERT INTO cards (deck_id, term, definition) VALUES ";
    let values = [];

    for (let i = 0; i < created.length; i++) {
      if (i == 0) {
        query += `($${index++}, $${index++}, $${index++})`;
      } else {
        query += `, ($${index++}, $${index++}, $${index++})`;
      }

      const { deck_id, term, definition } = created[i];
      if (!deck_id || !term || !definition) return res.sendStatus(400);

      values.push(deck_id);
      values.push(term);
      values.push(definition);
    }

    query += ";";

    try {
      await pool.query(query, values);
      console.log("CREATED SOME CARDS!");
      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.sendStatus(409);
    }
  });

  // UPDATE Card
  app.put(BASE_URL, hasToken, async (req, res) => {
    const id = req.user_id;
    if (!id) return res.sendStatus(401);

    const { updated } = req.body;
    if (!updated) return res.sendStatus(400);

    if (updated.length == 0) return res.sendStatus(200);

    let values = [];
    let query = "UPDATE cards SET ";
    let index = 1;

    let term = "term = CASE";
    let definition = "definition = CASE ";

    for (let i = 0; i < updated.length; i++) {
      term += ` WHEN card_id = ${updated[i].card_id} THEN $${index++}`;
      definition += ` WHEN card_id = ${updated[i].card_id} THEN $${index++}`;

      values.push(updated[i].term);
      values.push(updated[i].definition);
    }

    term += " ELSE term END, ";
    definition += " ELSE definition END";

    query += term;
    query += definition;

    query += ` WHERE card_id in (`;

    for (let i = 0; i < updated.length; i++) {
      if (i == 0) {
        query += `${updated[i].card_id}`;
      } else {
        query += `, ${updated[i].card_id}`;
      }
    }

    query += ");";

    try {
      await pool.query(query, values);
      console.log("UPDATED SOME CARDS!");
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

  // DELETE Card
  app.delete(BASE_URL, hasToken, async (req, res) => {
    const id = req.user_id;
    if (!id) return res.sendStatus(401);

    const { deleted } = req.body;
    if (!deleted) return res.sendStatus(400);

    if (deleted.length == 0) return res.sendStatus(200);

    let query = "DELETE FROM cards WHERE card_id in (";

    for (let i = 0; i < deleted.length; i++) {
      if (i == 0) {
        query += `$${i + 1}`;
      } else {
        query += `, $${i + 1}`;
      }
    }

    query += ");";

    try {
      await pool.query(query, deleted);
      console.log("DELETED SOME CARDS");
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });
};
