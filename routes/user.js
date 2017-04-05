var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Compared = require('../models/compared');
var Pool = require('../models/pool');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
	Compared.find({user: req.user}, function(err, compared) {
		if(err){
			return res.write('Login Error! Please refresh and try again.');
		}
		var pool;
		compared.forEach(function(comparison) {
			pool = new Pool(comparison.pool);
			// comparison = pool.generateArray();
		});
		res.render('user/profile', { compared: compared });
	});
});

router.get('/delete-saved/:id', isLoggedIn, function(req, res, next) {
	var documentId = req.params.id;
	Compared.findByIdAndRemove(documentId, function(err, compared) {
		if(err){
			return res.write('Login Error! Please refresh and try again.');
		}
	});
	res.redirect('/user/profile');
});


router.get('/logout', isLoggedIn, function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
	next();
});

router.get('/signup', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
	failureRedirect: 'signup',
	failureFlash: true
}), function(req, res, next) {
	if (req.session.oldUrl) {
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

router.get('/signin', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
	failureRedirect: 'signin',
	failureFlash: true
}), function(req, res, next) {
	if (req.session.oldUrl) {
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

module.exports = router;

//middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
};

function notLoggedIn(req, res, next) {
	if(!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
};