var express = require('express');
var router = express.Router();
var request = require('request');

var Movies = require('../models/movies');

router.get('/', function(req, res, next) {
  // var Movies = 
  var data;
  res.render('index', { title: 'Flick Pick', data: data });
});

router.post('/results', function(req, res, next) {
    var searchResult = req.body.search;
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

module.exports = router;
