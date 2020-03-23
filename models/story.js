"use strict";

module.exports = (sequelize, DataTypes) => {
  const story = sequelize.define(
    "story",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING
    },
    {}
  );

  story.associate = function(models) {
    story.belongsTo(models.homepage);
  };

  return story;
};

//still to add: (but how?):
//| homepageId | Integer   | yes      | Foreign key (references a homepage) |
