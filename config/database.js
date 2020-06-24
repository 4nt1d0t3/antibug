const Sequelize = require('sequelize');
module.exports = new Sequelize('bug_tracker', 'root', 'P4ul1sCh3nk0', {
	host: 'localhost',
	dialect: 'mysql',

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});
