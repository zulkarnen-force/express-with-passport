var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("../models/User.js");
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "supersecret";
module.exports = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = User.findOne({ email: jwt_payload.data.email });
      done(null, { payload: jwt_payload });
    } catch (error) {
      done(error, null);
    }
  })
);
