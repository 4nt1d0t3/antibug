const express = require('express'),
	app = express(),
	mysql = require('mysql'),
	db = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'P4ul1sCh3nk0',
		database: 'bug_tracker',
		insecureAuth: true
	});

const indexRoutes = require('./control/index'),
	projectRoutes = require('./control/projects');

app.use(indexRoutes);
app.use(projectRoutes);
app.use(express.static(__dirname + '/public'));


	db.connect((err) => {
		if(err) throw err;
		console.log('connected!')
	})

app.set('view engine', 'ejs');

app.listen(PORT=3000, () => {
	console.log('Bug server started!');
});
