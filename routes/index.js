var express = require('express');
var router = express.Router();
var request = require('request'); 

var Pool = require('../models/pool');
var Movie = require('../models/movies');

router.get('/', function(req, res, next) {
    var data;
    // console.log(req.session);
    var movies = Movie.find(function(err, docs){
    // console.log(req.session);
    if(!req.session.pool){
         var pool = new Pool(req.session.pool = {});
    }
    res.render('index', { title: 'Flick Pick', data: data, movies: docs });
    });
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

router.get('/add-to-moviepool/:id', function(req, res, next) {
    var movieId = req.params.id;
    // console.log("HERE IS movieId " + movieId);
    var url = "http://www.omdbapi.com/?i=" + movieId + "&tomatoes=true";

    request(url, function(error, response, body){
            if(!error && response.statusCode == 200) {
             var parsedbody = JSON.parse(body);
             if(!parsedbody["Response"] || parsedbody["Response"] === "False"){
                res.redirect("/");
             } else {
                // var movieDetail = {
                //     "Title": parsedbody["Title"]
                //     "Year": parsedbody["Year"],
                //     "Rated": parsedbody["Rated"],
                //     "Runtime": parsedbody["Runtime"],
                //     "Genre": parsedbody["Genre"],
                //     "Director": parsedbody["Director"],
                //     "Actors": parsedbody["Actors"],
                //     "Plot": parsedbody["Plot"],
                //     "Awards": parsedbody["Awards"],

                //     // "Poster": parsedbody["Poster"],
                //     // "Metascore": parsedbody["Metascore"],
                //     // "imdbID": parsedbody["imdbID"],
                //     // "imdbRating": parsedbody["imdbRating"],
                //     // "imdbVotes": parsedbody["imdbVotes"],
                //     // "tomatoMeter": parsedbody["tomatoMeter"],
                //     // "tomatoURL": parsedbody["tomatoURL"],
                //     // "test" : test
                // };

    var pool = new Pool(req.session.pool ? req.session.pool : {});
    var movies = [
        new Movie({ 
            imdbID: movieId,
            detailBody: parsedbody
            // title: movieDetail.Title
        })
    ];
    // console.log("MOVIES AFTER ADDITION: " + movies);
    pool.add(movies);
    req.session.pool = pool;
    res.redirect('/');
             }
            }
        });
});

router.get('/movie-pool', function(req, res, next) {
    if(!req.session.pool) {
        return res.render('movie-pool', {movies: null});
    }
    var pool = new Pool(req.session.pool);
    res.render('movie-pool', {movies: pool.generateArray()});
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
};
