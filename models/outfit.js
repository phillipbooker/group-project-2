module.exports = function(sequelize, DataTypes) {
  var Outfit = sequelize.define("Outfit", {
    price: {
      type: DataTypes.DECIMAL
    },
    category: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    }
  });

  Outfit.associate = function(models) {
    // We're saying that a Outfit should have a User ID
    // A Outfit can't be created without a User due to the foreign key constraint
    Outfit.hasMany(models.Article, {
      foreignKey: {
        allowNull: false
      }
    });

    Outfit.hasOne(models.Stylist, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Outfit;
};
