require("dotenv").config();
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

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

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

// Globals
const passport = require("passport");
const cookieSession = require("cookie-session");
const GoogleStrategy = require("passport-google-oauth20");

// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service.
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// server162.site:[port]/auth/redirect
const googleLoginData = {
  clientID:
    "535358974554-clfobhvtlf8sdsnoac36i4bl6cv8n092.apps.googleusercontent.com",
  clientSecret: "upkyj1pDCqWLnYtMKIIfxJmG",
  callbackURL: "/auth/redirect"
};

// Strategy configuration.
// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline.
passport.use(new GoogleStrategy(googleLoginData, gotProfile));

// Let's build a server pipeline!

// pipeline stage that just echos url, for debugging
app.use("/", printURL);

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

// Public static files
app.get("/*", express.static("public"));

// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here (not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
// passport.authenticate sends off the 302 response
// with fancy redirect URL containing request for profile, and
// client ID string to identify this app.

// Google redirects here after user successfully logs in
// This route has three handler functions, one run after the other.
app.get(
  "/auth/redirect",
  // for educational purposes
  function(req, res, next) {
    // console.log("at auth/redirect");
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
    // console.log("Logged in and using cookies!");

    res.redirect("/user/index.html");
  }
);

app.get(
  "/",
  isAuthenticated, // only pass on to following function if
  // user is logged in
  // serving files that start with /user from here gets them from ./
  function(req, res) {
    res.redirect("/user/index.html");
  }
);

// static files in /user are only available after login
app.get(
  "/user/*",
  isAuthenticated, // only pass on to following function if
  // user is logged in
  // serving files that start with /user from here gets them from ./
  express.static(".")
);

app.get("/translate", getTranslation);

app.post("/store", (req, res) => {
  let q = req.query;
  saveToDatabase(
    req.user.userId,
    q.source,
    q.translated,
    q.numShown,
    q.numCorrect
  );
  res.send();
});

app.get("/review", (req, res) => {
  getFromDatabase(req.query.id, (error, response) => {
    if (error) {
      console.log("THIS IS ERROR: ", error);
      res.json(error);
    } else {
      // console.log("THIS IS RESPONSE: ", response);
      res.json(response);
    }
  });
});

app.get("/allreviews", (req, res) => {
  getAllFromDatabase(req.user.userId, (error, response) => {
    if (error) {
      console.log("THIS IS ERROR: ", error);
      res.json(error);
    } else {
      // console.log("THIS IS RESPONSE: ", response);
      res.json(response);
    }
  });
});

app.put("/store", (req, res) => {
  let q = req.query;
  updateNums(q.id, q.numShown, q.numCorrect, err => {
    if (err) {
      console.log(err);
    }
  });
  res.send();
});

// gets which view to display for the user
app.get("/getView", (req, res) => {
  database.get(
    `SELECT COUNT(*) FROM flashcards WHERE userId = ?`,
    [req.user.userId.toString()],
    (err, response) => {
      if (err) throw err;
      // console.log("count is: ", response["COUNT(*)"]);
      if (response["COUNT(*)"] === 0) {
        res.send("main");
      } else {
        res.send("review");
      }
    }
  );
});

// gets user data to the App component
app.get("/getData", (req, res) => {
  res.send(req.user);
});

// finally, not found...applies to everything
app.use(fileNotFound);

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

// middleware functions

// print the url of incoming HTTP request
function printURL(req, res, next) {
  // console.log(req.url);
  next();
}

// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
  if (req.user) {
    // console.log("Req.session:", req.session);
    // console.log("Req.user:", req.user);
    next();
  } else {
    res.redirect("/login.html"); // send response telling
    // Browser to go to login page
  }
}

// function for end of server pipeline
function fileNotFound(req, res) {
  let url = req.url;
  res.type("text/plain");
  res.status(404);
  res.send("Cannot find " + url);
}

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate.
// The callback "done" at the end of each one resumes Passport's
// internal process.

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google.
function gotProfile(accessToken, refreshToken, profile, done) {
  // console.log("Google profile", profile);

  // here is a good place to check if user is in DB,
  // and to store him in DB if not already there.
  // Second arg to "done" will be passed into serializeUser,
  // should be key to get user out of database.

  database.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    firstName TEXT,
    lastName TEXT
  );
  `,
    err => {
      if (err) throw err;
      let commandStr = "SELECT * FROM users WHERE userId = ?";

      database.get(commandStr, [profile.id], (err, rows) => {
        // console.log("looking for userId = " + profile.id + " in users");
        if (err) throw err;
        if (!rows) {
          // console.log("user doesn't exist!");
          database.serialize(() => {
            database.run(
              `INSERT INTO users (
              userId,
              firstName,
              lastName
          )
          VALUES (?, ?, ?);`,
              [profile.id, profile.name.givenName, profile.name.familyName]
            );
          });
        } else {
          // console.log("user exists!");
        }
      });

      let dbRowID = profile.id;

      done(null, dbRowID);
    }
  );
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

  console.log("DeserializeUser. Input is:", dbRowID);

  // here is a good place to look up user data in database using
  // dbRowID. Put whatever you want into an object. It ends up
  // as the property "user" of the "req" object.

  let userData;

  let sqlMesssage = `SELECT * FROM users WHERE userId = ?`;
  database.get(sqlMesssage, [dbRowID], (err, row) => {
    if (err) {
      console.log(err);
      return done(null, dbRowID);
    } else {
      userData = row;
      done(null, userData);
    }
  });
});
