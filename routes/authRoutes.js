const passport = require("passport");

module.exports = function(app) {
  // auth login
  app.get("/auth/login", (req, res) => {
    res.render("login");
  });

  // auth logout
  app.get("/auth/logout", (req, res) => {
    // handle with passport
    res.send("logging out");
  });

  // auth with google
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile"],
      prompt: "select_account"
    })
  );

  // callback route for google to redirect to
  app.get(
    "/auth/google/redirect",
    passport.authenticate("google"),
    (req, res) => {
      res.send("You reached the callback URI");
    }
  );
};
