const express = require('express'),
	app = express(),
	mysql = require('mysql'),
	bodyParser = require('body-parser'),
	sessions = require('client-sessions'),
	passport = require('passport'),
	methodOverride = require('method-override');

const indexRoutes = require('./control/index'),
	projectRoutes = require('./control/projects'),
	db = require('./config/database');

db
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});
app.use(indexRoutes);
app.use(projectRoutes);
app.use(express.static(__dirname + '/public'));
app.use(
	sessions({
		cookieName: 'session',
		secret: 'K1m1s4t00t1e',
		duration: 30 * 60 * 1000 //30 min duration
	})
);
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

//MIDDLEWARE
//check if a user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

app.listen((PORT = 3000), () => {
	console.log('Bug server started!');
});
