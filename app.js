const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	sessions = require('client-sessions'),
	flash = require('connect-flash'),
	methodOverride = require('method-override');

const indexRoutes = require('./control/index'),
	projectRoutes = require('./control/projects'),
	bugRoutes = require('./control/bugs');

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

app.use(flash());
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));
app.use(
	sessions({
		cookieName: 'session',
		secret: 'K1m1s4t00t1e',
		duration: 30 * 60 * 1000,
		cookie: {
			maxAge: 60000,
			ephemeral: false,
			httpOnly: true
		}
	})
);

app.use((req, res, next) => {
	res.locals.currentUser = req.session.userName;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/projects', projectRoutes);
app.use('/projects/:id/bugs', bugRoutes);

app.set('view engine', 'ejs');

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
	console.log(`Bug server started on port: ${Port}`);
});
