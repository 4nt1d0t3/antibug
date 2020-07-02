require('dotenv').config()
const express = require('express'),
	app = express(),
	sessions = require('client-sessions'),
	flash = require('connect-flash'),
	methodOverride = require('method-override');

// Import the various routes from files
const indexRoutes = require('./control/index'),
	projectRoutes = require('./control/projects'),
	bugRoutes = require('./control/bugs');

// Parse JSON data
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

// Initialize Flash messages
app.use(flash());
// Initialize method-override on HTML forms
app.use(methodOverride('_method'));
// Initialize 'public' folder as static
app.use(express.static(__dirname + '/public'));
// Initialize client-session
app.use(
	sessions({
		cookieName: 'session',
		secret: process.env.SESSION_PASS,
		duration: 30 * 60 * 1000,
		cookie: {
			ephemeral: false,
			httpOnly: true
		}
	})
);
// Create global variables for flash messages and the current user
app.use((req, res, next) => {
	res.locals.currentUser = req.session.userName;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// Initialize routes from other files
app.use(indexRoutes);
app.use('/projects', projectRoutes);
app.use('/projects/:id/bugs', bugRoutes);

app.set('view engine', 'ejs');

// Select a port based on enviroment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Bug server started on port: ${PORT}`);
});
