'use strict';
module.exports = (sequelize, DataTypes) => {
  const Feature = sequelize.define('Feature', {
    title: DataTypes.TEXT,    
    content: DataTypes.TEXT
  }, { timestamps: false });
  Feature.associate = function (models) {
    // Feature.belongsTo(models.Feature, {
    //   foreignKey:'groupId',
    //   as: 'parent_group',
    //   sourceKey:'groupId',
    //   useJunctionTable: false 
    // }),
    Feature.hasMany(models.Feature, {
      foreignKey:'groupId',
      as: 'child_groups',
      sourceKey:'groupId',
      useJunctionTable: false 
    });
  };
  return Feature;
};