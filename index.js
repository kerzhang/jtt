const Twit = require("twit");
const path = require('path');
const config = require("./config");
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const T = new Twit(config);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "pug");

app.get("/", function(req, res) {
  res.render("app", { title: "Hey", message: 'long way to go ......'});
});

function getTwittes() {
  T.get("search/tweets", { q: "China since:2017-07-11", count: 10 }, function(
    err,
    data,
    response
  ) {
    return data;
  });
}

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

app.listen(3000, ()=> {
  console.log("Server is running on port: 3000 ");
});