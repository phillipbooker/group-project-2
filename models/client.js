module.exports = function(sequelize, DataTypes) {
  var Client = sequelize.define("Client", {
    name: {
      type: DataTypes.STRING
    },
    contact: {
      type: DataTypes.STRING
    }
  });

  Client.associate = function(models) {
    // We're saying that a Client should have a User ID
    // A Client can't be created without a User due to the foreign key constraint
    Client.hasOne(models.User, {
      foreignKey: {
        allowNull: false
      }
    });

    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Client.hasMany(models.Outfit, {
      onDelete: "cascade"
    });
  };
  return Client;
};
