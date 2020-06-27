const { sequelize } = require('../models');

const express = require('express');
const router = express.Router();
const Project = sequelize.import('../models/project');
const Bug = sequelize.import('../models/bug');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

//INDEX -- PROJECTS ROUTE
router.get('/projects', isLoggedIn, (req, res) => {
	Project.findAll({ where: { owner: req.session.userName } })
		.then((foundProjects) => {
			let projects = JSON.parse(JSON.stringify(foundProjects));
			// console.log(req.session)
			res.render('projects', { projects, user: req.session.userName });
		})
		.catch((err) => {
			console.log(err);
		});
});

//NEW Project form
router.get('/projects/new', isLoggedIn, (req, res) => {
	res.render('new');
});

//CREATE Project post route
router.post('/projects', isLoggedIn, (req, res) => {
	const name = req.body.name,
		description = req.body.description,
		owner = req.session.userName,
		status = req.body.status,
		deadline = req.body.deadline;
	Project.create({ name, description, owner, status, deadline })
		.then((newProject) => {
			res.redirect('/projects');
		})
		.catch((err) => console.log(err));
});

//SHOW Project details
router.get('/projects/:id', isLoggedIn, async (req, res) => {
	let foundProject = await Project.findOne({ where: { id: req.params.id } });
	Bug.findAll({ where: { project: foundProject.name }, raw: true })
		.then((foundBugs) => {
			let bug = JSON.parse(JSON.stringify(foundBugs));
			res.render('show', { bug: bug, project: foundProject });
		})
		.catch((err) => console.log(err));
});

//EDIT Project details
router.get('/projects/:id/edit', isLoggedIn, (req, res) => {
	Project.findOne({ where: { id: req.params.id } })
		.then((foundProject) => {
			res.render('edit', { project: foundProject });
		})
		.catch((err) => console.log(err));
});

// UPDATE Project details
router.put('/projects/:id', isLoggedIn, async (req, res) => {
	let description = req.body.description;
	let status = req.body.status;
	let deadline = req.body.deadline;
	console.log(description)
	Project.update(
		{
			description,
			status,
			deadline
		},
		{ where: { id: req.params.id } }
	).then(() => res.redirect(`/projects/${req.params.id}`));
});

//check if a user is logged in middleware
function isLoggedIn(req, res, next) {
	if (req.session.userId) {
		// console.log(req.session.userId);
		return next();
	}
	console.log('please login first!');
	res.redirect('/');
}

module.exports = router;
