const { sequelize } = require('../models');

const express = require('express');
const middleware = require('../middleware/index.js');
const router = express.Router({ mergeParams: true });
const Project = sequelize.import('../models/project');
const Bug = sequelize.import('../models/bug');

//INDEX -- PROJECTS ROUTE
router.get('/', middleware.isLoggedIn, (req, res) => {
	// Find all projects belonging to the current user
	Project.findAll({ where: { owner: req.session.userName } })
		.then((foundProjects) => {
			let projects = JSON.parse(JSON.stringify(foundProjects));
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
	// Save a new project to the database using variables provided by the user
	Project.create({ name, description, owner, status, deadline })
		.then((newProject) => {
			req.flash('success', `${newProject.name} succesfully created!`);
			res.redirect('/projects');
		})
		.catch((err) => console.log(err));
});

//SHOW Project details
router.get('/:id', middleware.isLoggedIn, async (req, res) => {
	// Find full project details and all associated bugs to be displayed
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
	// Find the project that will be edited
	const foundProject = await middleware.findProject(req.params.id);
	res.render('projects/edit', { project: foundProject });
});

// UPDATE Project details
router.put('/:id', middleware.isLoggedIn, async (req, res) => {
	// Find the project that is being updated
	const foundProject = await middleware.findProject(req.params.id);
	let description = req.body.description;
	let status = req.body.status;
	let deadline = req.body.deadline;
	// Update the found project in database with user inputed data
	foundProject.update({
		description,
		status,
		deadline
	});
	req.flash('success', 'Project updated');
	res.redirect(`/projects/${req.params.id}`);
});

//DESTROY Project route
router.delete('/:id', middleware.isLoggedIn, async (req, res) => {
	// Find the project the user wants to delete
	const foundProject = await middleware.findProject(req.params.id);
	foundProject.destroy();
	req.flash('error', 'Project destroyed!');
	res.redirect('/projects');
});

module.exports = router;
