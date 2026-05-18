const hasToken = require("../middlewares/hasToken");
require("dotenv").config();

module.exports = (pool, app) => {
  app.get("/logout", async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const findRefreshTokenQuery =
      "SELECT * FROM users WHERE refresh_token = $1";
    let foundUser = null;
    try {
      foundUser = await pool.query(findRefreshTokenQuery, [refreshToken]);
    } catch (error) {
      console.log(error);
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    if (!foundUser.rows.length) return res.sendStatus(204);
    const [user] = foundUser.rows;

    const clearRefreshTokenQuery =
      "UPDATE users SET refresh_token = '' WHERE user_id = $1";
    try {
      await pool.query(clearRefreshTokenQuery, [user.user_id]);
    } catch (error) {
      console.log(error);
    }

    return res.sendStatus(204);
  });
};
