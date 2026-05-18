const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);

  const query = `SELECT * from users where email = $1`;
  const result = await pool.query(query, [email]);

  if (!result.rows.length) return res.sendStatus(401);

  const user = result.rows[0];

  const isPassword = comparePassword(password, user.password);

  if (isPassword) {
    const payload = { name: user.email, id: user.user_id };
    const accessToken = createToken(
      payload,
      process.env.ACCESS_TOKEN,
      SECONDS_TO_EXPIRATION
    );
    const refreshToken = createToken(payload, process.env.REFRESH_TOKEN);
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure:
    // })
    // res.cookie("token", { accessToken, refreshToken });
    // jwt, refreshToken, {httpOnly: true, sameSite: "None", maxAge: 24*60*60*1000});
    // should be setting refresh token in cookie, and accessToken and roles as json;
    res.json({
      user,
      accessToken,
    });
  } else {
    return res.sendStatus(401);
  }
};
