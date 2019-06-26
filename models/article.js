module.exports = function(sequelize, DataTypes) {
  var Article = sequelize.define("Article", {
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

  Article.associate = function(models) {
    // We're saying that a Article should have a User ID
    // A Article can't be created without a User due to the foreign key constraint
    Article.belongsTo(models.Outfit, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Article;
};
