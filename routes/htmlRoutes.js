var db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index", {
      style: "landing.css"
    });
  });

  app.get("/about", function(req, res) {
    res.render("about", {
      style: "about.css"
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
      style: "client.css",
      user: req.user
    });
  });

  // Get target outfit and items
  app.get("/stylist/:id", isAuthenticated, function(req, res) {
    var outfitId = req.params.id;
    db.Outfit.findOne({ where: { id: outfitId } }).then(function(dbOutfit) {
      if (!dbOutfit || req.user.id.toString() !== dbOutfit.stylistId) {
        res.redirect("/404");
      } else {
        db.Item.findAll({ where: { outfitId } }).then(function(dbItems) {
          res.render("stylist", {
            style: "stylist.css",
            outfit: dbOutfit,
            items: dbItems,
            user: req.user,
            firstName: req.user.gname.split(" ")[0]
          });
        });
      }
    });
  });

  app.get("/outfits/:id", isAuthenticated, function(req, res) {
    db.Outfit.count({}).then(function(count) {
      let outfitId = req.params.id;
      if (
        isNaN(outfitId) ||
        !Number.isInteger(parseInt(outfitId)) ||
        outfitId < 1 ||
        outfitId > count
      ) {
        res.redirect("/404");
      } else {
        res.render("outfit", {
          style: "outfit.css",
          id: outfitId,
          user: req.user
        });
      }
    });
  });

  app.get("/:id/outfits", isAuthenticated, function(req, res) {
    if (req.user.id !== parseInt(req.params.id)) {
      res.redirect("/404");
    } else {
      res.render("user", {
        style: "outfit.css",
        id: req.params.id,
        user: req.user
      });
    }
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
