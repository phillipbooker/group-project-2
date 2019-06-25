var db = require("../models");

module.exports = function(app, passport) {
  app.get("/", isAuthenticated, function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // next, handler for url that starts login with Google.
  // The app (in login.handlebars) redirects to here
  // Kicks off login process by telling Browser to redirect to
  // Google. The object { scope: ['profile'] } says to ask Google
  // for their user profile information.
  app.get(
    "/auth/google",
    function(req, res, next) {
      console.log("at auth/google");
      next();
    },
    passport.authenticate("google", { scope: ["profile"] })
  );
  // passport.authenticate sends off the 302 response
  // with fancy redirect URL containing request for profile, and
  // client ID string to identify this app.

  // Google redirects here after user successfully logs in
  // This route has three handler functions, one run after the other.
  app.get(
    "/auth/redirect",
    function(req, res, next) {
      console.log("at auth/redirect");
      next();
    },
    // This will issue Server's own HTTPS request to Google
    // to access the user's profile information with the
    // temporary key we got in the request.
    passport.authenticate("google"),
    // then it will run the "gotProfile" callback function,
    // set up the cookie, call serialize, whose "done"
    // will come back here to send back the response
    // ...with a cookie in it for the Browser!
    function(req, res) {
      console.log("Logged in and using cookies!");
      res.render("index");
    }
  );

  // function to check whether user is logged in when trying to access
  // personal data
  function isAuthenticated(req, res, next) {
    if (req.user) {
      console.log("Req.session:", req.session);
      console.log("Req.user:", req.user);
      next();
    } else {
      res.render("login"); // send response telling
      // Browser to go to login page
    }
  }

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
