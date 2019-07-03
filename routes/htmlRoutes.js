var db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples,
        style: "landing.css"
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

  app.get("/role", isAuthenticated, function(req, res) {
    res.render("role", {
      style: "role.css",
      user: req.user
    });
  });

  app.get("/client", isAuthenticated, function(req, res) {
    res.render("client", {
      style: "client.css"
    });
  });

  // Get target outfit and items
  app.get("/stylist/:id", isAuthenticated, function(req, res) {
    var outfitId = req.params.id;

    db.Outfit.findOne({ where: { id: outfitId } }).then(function(dbOutfit) {
      db.Item.findAll({ where: { outfitId } }).then(function(dbItems) {
        res.render("stylist", {
          style: "stylist.css",
          outfit: dbOutfit,
          items: dbItems
        });
      });
    });
  });

  app.get("/stylist", isAuthenticated, function(req, res) {
    res.render("stylist", {
      style: "stylist.css"
    });
  });

  app.get("/outfits/:id", isAuthenticated, function(req, res) {
    res.render("outfit", {
      style: "client.css",
      id: req.params.id
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};

// function to check whether user is logged in when trying to access personal data
function isAuthenticated(req, res, next) {
  if (req.user) {
    next(); // go on to next middleware in the pipeline
  } else {
    if (req.url === "/role") {
      res.redirect("/auth/google");
    } else {
      res.redirect("/");
    }
  }
}
