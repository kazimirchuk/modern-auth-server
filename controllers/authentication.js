const jwt = require('jwt-simple');
const User = require('./../models/user');
const config = require('./../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();

	return jwt.encode({
		sub: user.id,
		iat: timestamp
	}, config.secret);
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password' });
	}

	User.findOne({ email }, function(error, existingUser) {
		if (error) {
			return next(error);
		}

		if (existingUser) {
			return res.status(422).send({ error: 'Email is in use' });
		}

		const user = new User({ email, password });

		user.save(function(error) {
			if (error) {
				return next(error);
			}

			res.send({ token: tokenForUser(user) });
		});
	});
};

exports.signin = function(req, res, next) {
	// passport automatically assigns user object to a request object
	res.send({ token: tokenForUser(req.user) });
};
