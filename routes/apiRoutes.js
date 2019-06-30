var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({
      where: { id: req.params.id }
    }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Create a new user
  app.post("/api/user", function(req, res) {
    db.User.create(req.body).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  //Find a user
  app.get("/api/user", function(req, res) {
    db.User.findOne({ where: { id: req.body.id } }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // Create a new outfit
  app.post("/api/outfit", function(req, res) {
    db.Outfit.create(req.body).then(function(dbOutfit) {
      res.json(dbOutfit);
    });
  });

  // PUT route for updating outfits
  app.put("/api/outfit", function(req, res) {
    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    console.log(req.body);
    db.Outfit.update(
      {
        category: req.body.category,
        price: req.body.price,
        image: req.body.image
      },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(function(dbOutfit) {
      res.json(dbOutfit);
    });
  });

  // Create a new item
  app.post("/api/item", function(req, res) {
    db.Item.create(req.body).then(function(dbItem) {
      res.json(dbItem);
    });
  });
};
