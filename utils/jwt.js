const jwt = require("jsonwebtoken");

module.exports = generateToken = (user) => {
  return jwt.sign(
    {
      iss: "zulkarnen.com",
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
      data: {
        id: user.id,
        email: user.email,
      },
    },
    "supersecret"
  );
};
