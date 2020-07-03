module.exports = (sequelize, DataTypes) => {
  const Bug = sequelize.define('bug', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    project: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Bug.associate = function(models) {
    // associations can be defined here
  };
  return Bug;
};