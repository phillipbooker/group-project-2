module.exports = function(sequelize, DataTypes) {
  var Outfit = sequelize.define("Outfit", {
    stylistId: {
      type: DataTypes.STRING
    },
    stylistName: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL
    },
    category: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.TEXT
    }
  });

  return Outfit;
};
