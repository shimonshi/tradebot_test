'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.TEXT,
      unique: true
    },
    password: DataTypes.TEXT,
    email: DataTypes.TEXT,
    registration_date: DataTypes.DATE,
    isAdmin: DataTypes.BOOLEAN
  }, {
    timestamps: false
  });

  User.associate = (models) => {
    User.hasMany(models.Key);
  };

  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};