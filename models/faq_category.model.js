'use strict';
module.exports = (sequelize, DataTypes) => {
  const Faq_category = sequelize.define('Faq_category', {
    name: DataTypes.TEXT,
    svg_icon: DataTypes.TEXT,
    fontawesome_icon: DataTypes.TEXT
  }, { timestamps: false });
  Faq_category.associate = function (models) {
    Faq_category.hasMany(models.Faq_question);
  };
  return Faq_category;
};