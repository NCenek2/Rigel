const { hashPassword } = require("../miscellaneous/hashing");

module.exports = (pool, app) => {
  app.post(`/register`, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(400);

    let hashedPassword = hashPassword(password);
    const query = "INSERT INTO users (email, password) VALUES ($1, $2)";

    try {
      await pool.query(query, [email, hashedPassword]);

      console.log("User Successfully Registered");
      return res.sendStatus(201);
    } catch (err) {
      if (err?.code === "23505") {
        console.log("User with that email already exists!");
        return res.sendStatus(409);
      } else {
        console.log(err);
        console.log("Internal Service Error");
        return res.sendStatus(500);
      }
    }
  });
};
