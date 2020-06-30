const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	sessions = require('client-sessions');
const methodOverride = require('method-override');

const indexRoutes = require('./control/index'),
	projectRoutes = require('./control/projects'),
	bugRoutes = require('./control/bugs');

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

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

app.use(indexRoutes);
app.use('/projects', projectRoutes);
app.use('/projects/:id/bugs', bugRoutes);

app.set('view engine', 'ejs');

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
	console.log(`Bug server started on port: ${Port}`);
});
