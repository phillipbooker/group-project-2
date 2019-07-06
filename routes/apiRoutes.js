var db = require("../models");
var Sequelize = require("sequelize");

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

  // Delete an item
  app.delete("/api/item", function(req, res) {
    db.Item.destroy({ where: { id: req.body.id } }).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  app.get("/api/search", function(req, res) {
    const Op = Sequelize.Op;
    let conditions;
    if (req.query.category === "all-categories") {
      conditions = {
        price: { [Op.lte]: req.query.price }
      };
    } else {
      conditions = {
        category: req.query.category,
        price: { [Op.lte]: req.query.price }
      };
    }

    db.Outfit.findAll({
      where: conditions
    }).then(results => {
      res.json(results);
    });
  });

  app.get("/api/getItems", function(req, res) {
    console.log(req.params);
    db.Item.findAll({
      where: {
        outfitId: req.query.id
      }
    }).then(results => {
      res.json(results);
    });
  });

  app.get("/api/outfits/:id", function(req, res) {
    db.Outfit.findAll({
      where: {
        stylistId: req.params.id
      }
    }).then(results => {
      res.json(results);
    });
  });
};
