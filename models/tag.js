'use strict';
module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('tag', {
    name: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.STRING }
  }, {
    classMethods: {
      associate: function(models) {
        Tag.belongsToMany(models.photo, { as: { singular: 'photo', plural: 'photos' }, through: 'photo_tags' });  
      }
    }
  });
  return Tag;
};