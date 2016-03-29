'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    name: DataTypes.STRING,
    localemail: DataTypes.STRING,
    localpassword: DataTypes.STRING,
    fbook_email: DataTypes.STRING,
    fbook_id: DataTypes.STRING,
    fbook_token: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.photo, { as: { singular: 'like', plural: 'likes' }, through: 'liked_photos' });
        User.belongsToMany(models.photo, { as: { singular: 'add', plural: 'adds' }, through: 'added_photos' });
      },
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.localpassword);
      }
    },
    getterMethods: {
      someValue: function() {
        return this.someValue;
      }
    },
    setterMethods: {
      someValue: function(value) {
        return this.someValue = value;
      }
    }
  });
  return User;
};