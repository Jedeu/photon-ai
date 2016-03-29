'use strict';
module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define('photo', {
    url: DataTypes.STRING,
    width: DataTypes.FLOAT,
    height: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        Photo.belongsToMany(models.tag, { as: { singular: 'tag', plural: 'tags' }, through: 'photo_tags' });
        Photo.belongsToMany(models.user, { as: { singular: 'liker', plural: 'likers' }, through: 'liked_photos' });
        Photo.belongsToMany(models.user, { as: { singular: 'adder', plural: 'adders' }, through: 'added_photos' });
      }
    }
  });
  return Photo;
};