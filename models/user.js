module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    gid: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    gname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  return User;
};
