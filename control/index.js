const express = require('express'),
	router = express.Router(),
	crypto = require('crypto'),
	bodyParser = require('body-parser'),
	argon2 = require('argon2'),
	mysql = require('mysql'),
	db = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'P4ul1sCh3nk0',
		database: 'bug_tracker',
		insecureAuth: true
	});

const jsonParser = bodyParser.json();
router.use(
	bodyParser.urlencoded({
		extended: true
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

//SIGN UP LOGIC
router.post('/register', jsonParser, async (req, res) => {
	const password = req.body.password;
	//Hash password using Argon2
	let hash;
	try {
		hash = await argon2.hash(password);
	} catch (err) {
		console.log(err);
	}
	//Define new user with username and hashed password to insert into DB
	const newUser = {
		username: req.body.username,
		pswrd: hash
	};
	//Insert into DB logic
	db.query('INSERT INTO user_table SET ?', newUser, (err, result) => {
		if (err) throw 'something is wrong with the query ' + err;
		console.log('Added user ' + result.username);
		//redirect to projects page after succesful login
		res.redirect('/projects');
	});
});

module.exports = router;
