require("dotenv").config();

// Load passport configurations
require("./config/passport-setup");

// Globals
const express = require("express");
const exphbs = require("express-handlebars");
const cookieSession = require("cookie-session");
const passport = require("passport");
// const enforce = require("express-sslify");

const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 24-hour session
    keys: [process.env.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
<<<<<<< HEAD
// app.use(enforce.HTTPS({ trustProtoHeader: true }));
=======
if (process.env.PORT) {
  console.log("in here");
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
>>>>>>> be6fadca3f6ccdec8b04d364192a3bc7c797c921

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Routes
require("./routes/authRoutes")(app);
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// handle any asynchronous error during express pipeline
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  req.logout();
  res.status(500).redirect("/");
});

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
