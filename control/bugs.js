const { sequelize } = require('../models');

const express = require('express');
const middleware = require('../middleware/index.js');
const router = express.Router({ mergeParams: true });
const Bug = sequelize.import('../models/bug');

//NEW bugs route
router.get('/new', middleware.isLoggedIn, async (req, res) => {
	// Find the project the new bug belongs to and access the ID and name in new.ejs file
	const foundProject = await middleware.findProject(req.params.id);
	res.render('bugs/new', { project: foundProject });
	// });
});

//CREATE bugs route
router.post('/', middleware.isLoggedIn, async (req, res) => {
	// Find project the bug is found in and access use the 'name' as project in database
	const bugOwner = await middleware.findProject(req.params.id);
	const name = req.body.name,
		description = req.body.description,
		project = bugOwner.name,
		status = req.body.status;
	// Create a new bug in database using variables above
	Bug.create({ name, description, project, status })
		.then((newBug) => {
			req.flash('success', 'Succesfully logged new bug!');
			res.redirect(`/projects/${req.params.id}`);
		})
		.catch((err) => console.log(err));
});

//EDIT bug route
router.get('/:bug_id/edit', middleware.isLoggedIn, async (req, res) => {
	// Find project to access its ID in edit.html file
	let foundProject = await middleware.findProject(req.params.id);
	// Find the bug that will be edited form database
	Bug.findOne({ where: { id: req.params.bug_id } })
		.then((foundBug) => {
			res.render('bugs/edit', { bug: foundBug, project: foundProject });
		})
		.catch((err) => console.log(err));
});

//UPDATE bug route
router.put('/:bug_id', middleware.isLoggedIn, (req, res) => {
	let description = req.body.description;
	let status = req.body.status;
	// Update bug in database
	Bug.update(
		{
			description,
			status
		},
		{ where: { id: req.params.bug_id } }
	).then(() => {
		req.flash('success', 'Bug updated');
		res.redirect(`/projects/${req.params.id}/bugs/${req.params.bug_id}`);
	});
});

//DESTROY bug route
router.delete('/:bug_id', middleware.isLoggedIn, (req, res) => {
	Bug.destroy({ where: { id: req.params.bug_id } }).then(() => {
		req.flash('error', 'Bug destroyed!');
		res.redirect(`/projects/${req.params.id}`);
	});
});

//SHOW Bugs route
router.get('/:bug_id', middleware.isLoggedIn, async (req, res) => {
	// Find the project the bug belongs to and use the ID in show.ejs file
	let foundProject = await middleware.findProject(req.params.id);
	// Find the selected bug from database
	Bug.findOne({ where: { id: req.params.bug_id } })
		.then((foundBug) => {
			res.render('bugs/show', { bug: foundBug, project: foundProject });
		})
		.catch((err) => console.log(err));
});

module.exports = router;
