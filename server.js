require("dotenv").config();

// Globals
const passport = require("passport");
const cookieSession = require("cookie-session");
const GoogleStrategy = require("passport-google-oauth20");
var express = require("express");
var exphbs = require("express-handlebars");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

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

// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service.
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// https://[our-app-name]/auth/redirect
const googleLoginData = {
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.redirect
};

// Strategy configuration.
// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline.
passport.use(new GoogleStrategy(googleLoginData, gotProfile));

// pipeline stage that just echos url, for debugging
app.use("/", function printURL(req, res, next) {
  console.log(req.url);
  next();
});

// Check validity of cookies at the beginning of pipeline
// Will get cookies out of request, decrypt and check if
// session is still going on.
app.use(
  cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // meaningless random string used by encryption
    keys: ["hanger waldo mercy dance"]
  })
);

// Initializes request object for further handling by passport
app.use(passport.initialize());

// If there is a valid cookie, will call deserializeUser()
app.use(passport.session());

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate.
// The callback "done" at the end of each one resumes Passport's
// internal process.

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google.
function gotProfile(accessToken, refreshToken, profile, done) {
  console.log("Google profile", profile);
  // here is a good place to check if user is in DB,
  // and to store him in DB if not already there.
  // Second arg to "done" will be passed into serializeUser,
  // should be key to get user out of database.

  let dbRowID = 1; // temporary! Should be the real unique
  // key for db Row for this user in DB table.
  // Note: cannot be zero, has to be something that evaluates to
  // True.

  done(null, dbRowID);
}

// Part of Server's sesssion set-up.
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie.
passport.serializeUser((dbRowID, done) => {
  console.log("SerializeUser. Input is", dbRowID);
  done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie.
// Where we should lookup user database info.
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((dbRowID, done) => {
  console.log("deserializeUser. Input is:", dbRowID);
  // here is a good place to look up user data in database using
  // dbRowID. Put whatever you want into an object. It ends up
  // as the property "user" of the "req" object.
  let userData = { userData: "data from db row goes here" };
  done(null, userData);
});

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app, passport);

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
