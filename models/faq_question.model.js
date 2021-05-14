'use strict';
module.exports = (sequelize, DataTypes) => {
  const Faq_question = sequelize.define('Faq_question', {
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT
  }, { timestamps: false });
  Faq_question.associate = function (models) {
    Faq_question.belongsTo(models.Faq_category);
  };
  return Faq_question;
};