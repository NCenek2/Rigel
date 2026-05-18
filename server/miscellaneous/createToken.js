const jwt = require("jsonwebtoken");
module.exports = (payload, secret, expiresIn = 24 * 60 * 60) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });
  return token;
};
