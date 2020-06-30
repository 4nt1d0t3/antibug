const { sequelize } = require('../models');

const express = require('express'),
	router = express.Router({ mergeParams: true }),
	argon2 = require('argon2'),
	User = sequelize.import('../models/user');

//LANDING PAGE
router.get('/', (req, res) => {
	res.render('landing');
});

//SHOW REGISTER FORM
router.get('/register', (req, res) => {
	res.render('register');
});

//REGISTER LOGIC
router.post('/register', async (req, res) => {
	//Hash password using Argon2
	const username = req.body.username;
	let hashedPassword = await argon2.hash(req.body.password);

	//Define new user with username and hashed password to insert into DB
	const excistingUser = await User.findOne({ where: { username: username } });
	if (!excistingUser) {
		User.create({ username: username, password: hashedPassword }).then((user) => {
			req.session.userId = user.id;
			req.session.userName = user.username;
			req.flash('success', `Welcome ${req.session.userName}!`);
			res.redirect('/projects');
		});
	} else {
		req.flash('error', 'Username is already taken');;
		res.redirect('/register');
	}
});

//SHOW LOGIN FORM
router.get('/login', (req, res) => {
	res.render('login');
});

//LOGIN LOGIC
router.post('/login', async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	// 	//retrieve user data from DB
	let loggedUser = await User.findOne({ raw: true, where: { username: username } });
	if (loggedUser) {
		//check if password matches
		if (!await argon2.verify(loggedUser.password, password)) {
			req.flash('error', 'Incorrect Password');
			res.redirect('/login');
		} else {
			req.session.userId = loggedUser.id;
			req.session.userName = loggedUser.username;
			req.flash('success', `Nice to see you again ${req.session.userName}!`);
			res.redirect('/projects');
		}
	} else {
		req.flash('error', 'Incorrect Username');
		res.redirect('/login');
	}
});

//LOGOUT ROUTE
router.get('/logout', (req, res) => {
	req.session.reset();
	req.flash('success', 'Succesfully logged out!');
	res.redirect('/');
});

module.exports = router;
