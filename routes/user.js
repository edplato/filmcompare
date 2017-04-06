var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Saved = require('../models/saved');
var Pool = require('../models/pool');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
	Saved.find({user: req.user}, function(err, saved) {
		if(err){
			return res.write('Login Error! Please refresh and try again.');
		}
		var pool;
		saved.forEach(function(savedMovie) {
			pool = new Pool(savedMovie.pool);
		});
		res.render('user/profile', { saved: saved });
	});
});

router.get('/delete-saved/:id', isLoggedIn, function(req, res, next) {
	var documentId = req.params.id;
	Saved.findByIdAndRemove(documentId, function(err, saved) {
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