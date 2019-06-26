module.exports = function(sequelize, DataTypes) {
  var Stylist = sequelize.define("Stylist", {
    name: {
      type: DataTypes.STRING
    },
    contact: {
      type: DataTypes.STRING
    }
  });

  Stylist.associate = function(models) {
    // We're saying that a Stylist should have a User ID
    // A Stylist can't be created without a User due to the foreign key constraint
    Stylist.hasOne(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Stylist;
};
