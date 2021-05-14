'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    title: DataTypes.TEXT,
    price: DataTypes.TEXT,
    first_info: DataTypes.TEXT,
    second_info: DataTypes.TEXT,
    third_info: DataTypes.TEXT
  }, {
    timestamps: false
  });
  Plan.associate = function (models) {
    // associations can be defined here
  };
  return Plan;
};