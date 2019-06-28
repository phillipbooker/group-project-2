module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    outfitId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL
    },
    image: {
      type: DataTypes.STRING
    },
    purchase: {
      type: DataTypes.STRING
    }
  });

  return Item;
};
