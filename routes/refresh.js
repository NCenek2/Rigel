const createToken = require("../miscellaneous/createToken");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  app.get("/refresh", (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    console.log(`refreshToken ${refreshToken}`);

    // 403 if cant findRefreshtoken with refreshToken
    let payload = {};
    let refreshError = false;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        // Add or decoded.user_id != foundUser.user_id
        console.log(`refreshToken Error ${err}`);
        refreshError = true;
        return;
      }

      console.log("NEW TOKEN INFO");
      payload = { user_id: decoded.user_id, email: decoded.email };
    });

    if (refreshError) return res.sendStatus(401);

    const accessToken = createToken(payload, process.env.ACCESS_TOKEN, 15);
    console.log("NEW ACCESS TOKEN GRANTED");
    res.json({
      userInfo: payload,
      accessToken,
    });
  });
};
