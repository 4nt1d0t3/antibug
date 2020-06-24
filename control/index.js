const { sequelize } = require('../models');

const express = require('express'),
	router = express.Router(),
	argon2 = require('argon2'),
	bodyParser = require('body-parser'),
	sessions = require('client-sessions'),
	db = require('../config/database'),
	User = sequelize.import('../models/user');

router.use(bodyParser.json());
router.use(
	bodyParser.urlencoded({
		extended: true
	})
);
const passport = require('../config/passport/passport');
router.use(passport.initialize());
router.use(passport.session());
router.use(
	sessions({
		cookieName: 'session',
		secret: 'K1m1s4t00t1e',
		duration: 30 * 60 * 1000 //30 min duration
	})
);

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
	let hashedPassword;
	try {
		hashedPassword = await argon2.hash(req.body.password);
	} catch (err) {
		console.log(err);
	}
	//Define new user with username and hashed password to insert into DB
	const excistingUser = await User.findOne({ where: { username: username } });
	if (!excistingUser) {
		User.create({ username: username, password: hashedPassword }).then((user) => {
			console.log(user.dataValues);
			res.redirect('/projects');
		});
	} else {
		console.log('Username is already taken');
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
	let redirect = (destination) => res.redirect(destination);
	// 	//retrieve user data from DB
	let loggedUser = await User.findOne({ raw: true, where: { username: username } });
	if (loggedUser) {
		//check if password matches
		if (!await argon2.verify(loggedUser.password, password)) {
			console.log('wrong password');
			redirect('/login');
		} else {
			console.log(loggedUser.username);
			console.log('correct password');
			req.session.userId = loggedUser.username;
			redirect('/projects');
		}
	} else {
		console.log('Please enter correct username');
		redirect('/login');
	}
});

//LOGOUT ROUTE
router.get('/logout', (req, res) => {
	req.logout();
	// req.flash('success', 'Succesfully logged out!');
	res.redirect('/');
});

module.exports = router;
