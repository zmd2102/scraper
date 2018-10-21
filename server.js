var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.get("/scrape", function(req, res) {
  axios.get("http://www.espn.com/nfl/").then(function(response,) {
    var $ = cheerio.load(response.data);
    $("article .text-container").each(function(i, element) {
      var result = {};
      result.title = $(this).children(".item-info-wrap").children("h1").text();
      result.link = $(this).children(".item-info-wrap").children("h1").children("a").attr("href")});
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
