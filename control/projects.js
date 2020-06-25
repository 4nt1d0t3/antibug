const { sequelize } = require('../models');

const express = require('express');
const router = express.Router();
const Project = sequelize.import('../models/project');

//INDEX -- PROJECTS ROUTE
router.get('/projects', isLoggedIn, (req, res) => {
	Project.findAll({ where: { owner: req.session.userName } }).then((foundProjects) => {
		let projects = JSON.parse(JSON.stringify(foundProjects))
		console.log(req.session)
		res.render('projects', { projects, user:req.session.userName });
	}).catch(err => {console.log(err)});
});

//SHOW Project details
router.get('/projects/:id', isLoggedIn, (req, res) =>{
	Project.findByPk(req.params.userId).then((foundProject) => {
		res.render('show', {project:foundProject})
	}).catch(err => console.log(err))
})


//check if a user is logged in middleware
function isLoggedIn(req, res, next) {
	if (req.session.userId) {
		console.log(req.session.userId);
		return next();
	}
	console.log('please login first!');
	res.redirect('/');
}

module.exports = router;
