module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    owner: DataTypes.STRING,
    status: DataTypes.STRING,
    deadline: DataTypes.DATE,
    no_of_bugs: DataTypes.INTEGER
  }, {});
  Project.associate = function(models) {
    // associations can be defined here
  };
  return Project;
};