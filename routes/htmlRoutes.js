var db = require("../models");

module.exports = function(app) {
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

  app.get("/landing", function(req, res) {
    res.render("landing", {
      style: "landing.css"
    });
  });

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

// function to check whether user is logged in when trying to access
//   personal data
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
