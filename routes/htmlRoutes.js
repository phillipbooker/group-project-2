var db = require("../models");

// Globals
const passport = require("passport");
const cookieSession = require("cookie-session");
const GoogleStrategy = require("passport-google-oauth20");

// Google login credentials, used when the user contacts
// Google, to tell them where they are trying to login to, and show
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

module.exports = function(app) {
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

  // pipeline stage that just echos url, for debugging
  app.use("/", function printURL(req, res, next) {
    console.log(req.url);
    next();
  });

  app.get("/", function(req, res) {
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
  // function isAuthenticated(req, res, next) {
  //   if (req.user) {
  //     console.log("Req.session:", req.session);
  //     console.log("Req.user:", req.user);
  //     next();
  //   } else {
  //     res.render("index"); // send response telling
  //     // Browser to go to splash page
  //   }
  // }

  app.get("/role", function(req, res) {
    res.render("role", {
      style: "role.css"
    });
  });

  app.get("/client", function(req, res) {
    res.render("client", {
      style: "client.css"
    });
  });

  app.get("/stylist", function(req, res) {
    res.render("stylist", {
      style: "stylist.css"
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
