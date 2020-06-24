const argon2 = require('argon2');
const passport = require('passport');
const { sequelize } = require('../../models');
const User = sequelize.import('../../models/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = passport.use(
	'local',
	new LocalStrategy((username, password, done) => {
		User.findAll({ where: { username } })
			.then((user) => {
				if (!user) {
					return done(null, false, { message: 'Incorrect Username' });
				}
				if (!user.password === password) {
					return done(null, false, { message: 'Incorrect Password' });
				}
				return done(null, user);
			})
			.catch((err) => done(err));
		// //serialize
		// passport.serializeUser(function(user, done) {
		// 	done(null, user.id);
		// });
		// // deserialize user
		// passport.deserializeUser(function(id, done) {
		// 	Auth.findById(id).then((user) => {
        //             done(null, user.get())
        //             .catch(err => done(user.errors, null))
					
		// 		}
		// 	);
		// });
	})
);
