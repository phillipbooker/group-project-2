module.exports = function(sequelize, DataTypes) {
  var Fav = sequelize.define("Fav", {
    clientId: {
      type: DataTypes.INTEGER
    },
    outfitId: {
      type: DataTypes.INTEGER
    }
  });

  return Fav;
};
