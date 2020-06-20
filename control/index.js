const express = require('express'),
	router = express.Router(),
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

//REGISTER LOGIC
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

//SHOW SIGN IN FORM
router.get('/login', (req, res) => {
	res.render('login');
});

//SIGN IN LOGIC
router.post('/login', jsonParser, (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let redirect = (destination) => res.redirect(destination);
	let query = 'SELECT username, pswrd FROM user_table WHERE username = ?';
	//Check if both username and password entered
	if (username && password) {
		//retrieve user data from DB
		db.query(query, [ username ], async (err, res, fields) => {
			if (err) {
				console.log(`Error in the query ${err}`);
			} else {
				//check if username exists
				if (res.length) {
					//check if password matches
					if (!await argon2.verify(res[0]['pswrd'], password)) {
						console.log('wrong password');
						redirect('/login')
					} else {
						console.log('correct password');
						redirect('/projects');
					}
				} else {
					console.log('Username not found');
					redirect('/login')
				}
			}
		});
	} else {
		redirect('/login')
		console.log('Please enter both username and password');
	}
});

module.exports = router;
