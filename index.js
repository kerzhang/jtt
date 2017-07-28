const Twit = require("twit");
const path = require("path");
const config = require("./config");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const T = new Twit(config);

let userName = "";
let userProfileImgUrl = "";
let backgroundImgUrl = "";
let myTweets;
let myFriends;
let myChats;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");

//Verify and local user information
T.get("account/verify_credentials", { skip_status: true })
  .catch(function(err) {
    console.log("caught error", err.stack);
  })
  .then(function(result) {
    userName = result.data.screen_name;
    userProfileImgUrl = result.data.profile_image_url_https;
    backgroundImgUrl = result.data.profile_banner_url;
    // console.log(result.data);

    T.get("friends/list", { screen_name: userName, count: 5 }, function(
      err,
      data,
      response
    ) {
      myFriends = data.users;
      // console.log(data.users);
    });

    T.get("direct_messages/sent", { count: 5 }, function(
      err,
      data,
      response
    ) {
      myChats = data;
      // console.log(data);
    });

    T.get(
      "statuses/user_timeline",
      { screen_name: userName, count: 5 },
      function(err, data, response) {
        myTweets = data;
        // console.log(data);
      }
    );
  });

  function postTweet(txt) {
    T.post("statuses/update", { status: txt }, function(err, data, response) {
      if (err) throw err;
      console.log(data);
    });
  }

  function twitterTimeConvert(createdAt) {
    var tweetDate = Date.parse(createdAt.replace(/( \+)/, ' UTC$1'));
    var now = Date.now();
    var getFormatted = function dhm(ms) {
      days = Math.floor(ms / (24 * 60 * 60 * 1000));
      daysms = ms % (24 * 60 * 60 * 1000);
      hours = Math.floor((daysms) / (60 * 60 * 1000));
      hoursms = ms % (60 * 60 * 1000);
      minutes = Math.floor((hoursms) / (60 * 1000));
      minutesms = ms % (60 * 1000);
      sec = Math.floor((minutesms) / (1000));
      return days + ":" + hours + ":" + minutes + ":" + sec;
    }

    //format example days:hours:minutes:sec 
    return getFormatted(now - tweetDate);
  }

app.get("/", function(req, res) {
  // T.get("statuses/user_timeline", { screen_name: userName, count: 5 }, function(
  //   err,
  //   data,
  //   response
  // ) {
  //   myTweets = data;
  res.render("index", {
    tweets: myTweets,
    friends: myFriends,
    chats: myChats,
    userProfileImgUrl: userProfileImgUrl,
    username: userName,
    backgroundImg: backgroundImgUrl
  });
  // });
});

app.post('/', function(req, res) {
  let tweet = req.body.tweetText;
  postTweet(tweet);
  return res.redirect('/');
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server is running on port: 3000 ");
});
