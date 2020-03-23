"use strict";

module.exports = (sequelize, DataTypes) => {
  const homepage = sequelize.define(
    "homepage",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: DataTypes.TEXT,
      backgroundColor: {
        type: DataTypes.STRING,
        defaultValue: "#ffffff"
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: "#000000"
      }
    },
    {}
  );
  homepage.associate = function(models) {
    homepage.belongsTo(models.user);
    homepage.hasMany(models.story);
  };
  return homepage;
};

//still to add: (in model or otherwise?)
//| userId          | Integer          | yes      | Foreign key (references a user)   |
