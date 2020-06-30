const { sequelize } = require('../models');

const express = require('express');
const middleware = require('../middleware/index.js');
const router = express.Router({ mergeParams: true });
const Project = sequelize.import('../models/project');
const Bug = sequelize.import('../models/bug');

//INDEX -- PROJECTS ROUTE
router.get('/', middleware.isLoggedIn, (req, res) => {
	Project.findAll({ where: { owner: req.session.userName } })
		.then((foundProjects) => {
			let projects = JSON.parse(JSON.stringify(foundProjects));
			// console.log(req.session)
			res.render('projects/index', { projects, user: req.session.userName });
		})
		.catch((err) => {
			console.log(err);
		});
});

//NEW Project form
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('projects/new');
});

//CREATE Project post route
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/:id', middleware.isLoggedIn, async (req, res) => {
	let foundProject = await middleware.findProject(req.params.id);
	Bug.findAll({ where: { project: foundProject.name } })
		.then((foundBugs) => {
			let bug = JSON.parse(JSON.stringify(foundBugs));
			res.render('projects/show', { bug: bug, project: foundProject });
		})
		.catch((err) => console.log(err));
});

//EDIT Project details
router.get('/:id/edit', middleware.isLoggedIn, async (req, res) => {
	const foundProject = await middleware.findProject(req.params.id);
	res.render('projects/edit', { project: foundProject });
});

// UPDATE Project details
router.put('/:id', middleware.isLoggedIn, async (req, res) => {
	const foundProject = await middleware.findProject(req.params.id);
	let description = req.body.description;
	let status = req.body.status;
	let deadline = req.body.deadline;
	foundProject.update({
		description,
		status,
		deadline
	});
	res.redirect(`/projects/${req.params.id}`);
});

//DESTROY Project route
router.delete('/:id', middleware.isLoggedIn, async (req, res) => {
	const foundProject = await middleware.findProject(req.params.id);
	foundProject.destroy();
	res.redirect('/projects');
});

module.exports = router;
