var express = require('express');
var router = express.Router();
var request = require('request'); 

var Pool = require('../models/pool');
var Movie = require('../models/movies');
var Saved = require('../models/saved');

router.get('/', function(req, res, next) {
    var data;
    var movies = Movie.find(function(err, docs){
    if(!req.session.pool){
         var pool = new Pool(req.session.pool = {});
    }
    res.render('index', { data: data, movies: docs });
    });
});

router.get('/results', function(req, res, next) {
    var searchResult = req.query.search;
    var url = "https://api.themoviedb.org/3/search/movie?api_key=APIKEY&query=" + searchResult;
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
         var parsedbody = JSON.parse(body);
         if(!parsedbody["total_results"] || parsedbody["total_results"] <= 0){
            res.redirect("/");
         } else {
            res.render("index", { data: parsedbody });
         }
        }
    });
});

router.get('/add-to-moviepool/:id', function(req, res, next) {
    var movieId = req.params.id;
    var url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=APIKEY";
    var errMsg = req.flash('error')[0];
    request(url, function(error, response, body){
            if(!error && response.statusCode == 200) {
             var parsedbody = JSON.parse(body);
             if(error || parsedbody["status_code"] === 34){
                req.flash('error', 'Error storing movie onto database. Try again later.');
                res.redirect("/");
             } else {
    var pool = new Pool(req.session.pool ? req.session.pool : {});
    var movies = [
        new Movie({ 
            id: movieId,
            detailBody: parsedbody
        })
    ];
    pool.add(movies, movieId);
    req.session.pool = pool;
    res.redirect('back');
             }
            }
        });
});

router.get('/remove/:id', function(req, res, next) {
    var movieId = req.params.id;
    var pool = new Pool(req.session.pool ? req.session.pool : {});
    pool.removeItem(movieId);
    req.session.pool = pool;
    res.redirect('back');
});

router.get('/navremove/:id', function(req, res, next) {
    var movieId = req.params.id;
    var pool = new Pool(req.session.pool ? req.session.pool : {});
    pool.removeItem(movieId);
    res.redirect('back');
});

router.get('/movie-pool', function(req, res, next) {
    if(!req.session.pool) {
        return res.render('movie-pool', {movies: null});
    }
    var pool = new Pool(req.session.pool);
    res.render('movie-pool', {movies: pool.generateArray()});
});

router.get('/watch-later/:id', isLoggedIn, function(req, res, next) {
    var movieId = req.params.id;
    if(!req.session.pool) {
        return res.redirect('/movie-pool');
    }
    var pool = new Pool(req.session.pool);
    var errMsg = req.flash('error')[0];
    var saved = new Saved({
        user: req.user,
        pool: pool.items[movieId]
    });
    saved.save(function(err, result) {
        if(err){
            req.flash('error', 'Error storing movie onto database. Try again later.');
        }
        req.session.pool = pool;
        res.redirect('/remove/' + movieId);
    });
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
};
