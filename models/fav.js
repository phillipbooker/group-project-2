module.exports = function(sequelize, DataTypes) {
  var Fav = sequelize.define("Fav", {
    clientId: {
      type: DataTypes.STRING
    },
    outfitId: {
      type: DataTypes.STRING
    }
  });

  return Fav;
};
