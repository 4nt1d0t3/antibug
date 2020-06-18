const express = require('express'),
	app = express(),
	mysql = require('mysql'),
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'P4ul1sCh3nk0',
		database: 'bug_tracker',
		insecureAuth: true
	});

	connection.connect((err) => {
		if(err) throw err;
		console.log('connected!')
	})

app.set('view engine', 'ejs');

//LANDING PAGE
app.get('/', (req, res) => {
	res.render('landing');
});

//INDEX -- PROJECTS ROUTE
app.get('/projects', (req, res) => {
	res.render('projects');
});

app.listen(process.env.PORT, process.env.IP, () => {
	console.log('Bug server started!');
});
