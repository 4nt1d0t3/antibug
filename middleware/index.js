const { sequelize } = require('../models');
const Project = sequelize.import('../models/project.js');

//check if a user is logged in middleware
module.exports.isLoggedIn = function(req, res, next) {
	if (req.session.userId) {
		return next();
	}
	req.flash('error', 'Please login first!')
	res.redirect('/');
};

//Find project
module.exports.findProject = function(id) {
	return Project.findOne({ where: { id: id } });
};
