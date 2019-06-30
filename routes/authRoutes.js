const express = require("express");
const router = express.Router();
const passport = require("passport");

// auth login
router.get("/login", (req, res) => {
  res.render("login");
});

// auth logout
router.get("/logout", (req, res) => {
  // handle with passport
  res.send("logging out");
});

// auth with google
router.get(
  "/google",
  (req, res, next) => {
    console.log("in here");
    next();
  },
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "select_account"
  })
);

// callback route for google to redirect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send("You reached the callback URI");
});

module.exports = router;
