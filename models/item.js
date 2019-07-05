module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    outfitId: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL
    },
    image: {
      type: DataTypes.TEXT
    },
    purchase: {
      type: DataTypes.STRING
    }
  });

  return Item;
};
