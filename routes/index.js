var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var request = require('request'); 

var Movies = require('../models/movies');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', function(req, res, next) {
  // var Movies = 
  var data;
  res.render('index', { title: 'Flick Pick', data: data });
});

router.get('/results', function(req, res, next) {
    var searchResult = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + searchResult;
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
         var parsedbody = JSON.parse(body);
         if(!parsedbody["Response"] || parsedbody["Response"] === "False"){
            res.redirect("/");
         } else {
            res.render("index", { title: 'Flick Pick', data: parsedbody });
         }
        }
    });
});

router.get('/user/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/profile', function(req, res, next) {
    res.render('user/profile');
})

module.exports = router;


