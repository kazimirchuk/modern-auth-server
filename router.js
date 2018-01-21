const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {
	session: false // disable default cookie-based session
});

const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
	app.get('/', requireAuth, function(req, res, next) {
		res.send({ message: 'Secret information that requires Auth!' });
	});
	app.post('/signup', Authentication.signup);
	app.post('/signin', requireSignin, Authentication.signin);
};
