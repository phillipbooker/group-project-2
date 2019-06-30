const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const db = require("../models");

const googleRedirect = process.env.PORT
  ? "/auth/google/redirect"
  : "http://localhost:3000/auth/google/redirect";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  db.User.findOne({ where: { id: userId } }).then(user => {
    console.log("result of findOne: ", user);
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: googleRedirect
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      db.User.findOrCreate({
        where: { gid: profile.id, gname: profile.displayName }
      }).then(([user, created]) => {
        let userData = user.get({ plain: true });
        console.log(userData);
        console.log("created: ", created);
        return done(null, userData);
      });
    }
  )
);
