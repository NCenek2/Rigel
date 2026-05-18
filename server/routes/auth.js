const hasToken = require("../middlewares/hasToken");
const createToken = require("../miscellaneous/createToken");
const { comparePassword } = require("../miscellaneous/hashing");
require("dotenv").config();

module.exports = (pool, app) => {
  const BASE_URL = "/auth";
  pool.connect();

  app.get(BASE_URL, (req, res) => {
    res.send("Anyone can see this: JWT");
  });

  app.get(`${BASE_URL}/users`, hasToken, async (req, res) => {
    const query = `SELECT * FROM users`;

    try {
      const result = await pool.query(query);
      return res.send(result.rows);
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  });

  app.post(`${BASE_URL}/login`, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(400);

    const query = `SELECT * from users where email = $1`;
    const result = await pool.query(query, [email]);

    if (!result.rows.length) return res.sendStatus(401);

    const [user] = result.rows;
    const isPassword = comparePassword(password, user.password);

    if (isPassword) {
      const payload = { user_id: user.user_id, email: user.email };
      const accessToken = createToken(
        payload,
        process.env.ACCESS_TOKEN,
        15 * 1000 * 1000 * 1000
      );
      const refreshToken = createToken(payload, process.env.REFRESH_TOKEN, 60);

      const query = "UPDATE users SET refresh_token = $1 WHERE user_id = $2";
      try {
        await pool.query(query, [refreshToken, user.user_id]);
      } catch (error) {
        console.log(error);
      }

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        userInfo: {
          user_id: user.user_id,
          email: user.email,
        },
        accessToken,
      });
    } else {
      return res.sendStatus(401);
    }
  });
};
