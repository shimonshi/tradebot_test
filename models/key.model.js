'use strict';

const md5 = require('md5');

module.exports = (sequelize, DataTypes) => {
  const Key = sequelize.define('Key', {
    key: DataTypes.TEXT,
    sub_length: DataTypes.INTEGER,
    sub_start: DataTypes.INTEGER,
    paused_total: DataTypes.INTEGER,
    paused_last_start: DataTypes.INTEGER,
    paused_last_length: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  Key.associate = function (models) {
    Key.belongsTo(models.User);
  };
  Key.prototype.generate = function(sub_length_days) {
    this.key = md5(Math.random().toString(36).substr(2, 16));
    this.sub_length_seconds = sub_length_days * 24 * 60 * 60;
  };
  return Key;
};