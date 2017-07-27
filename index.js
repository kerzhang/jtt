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

  function postTweet() {
    // T.post("statuses/update", { status: txt }, function(err, data, response) {
    //   console.log(data);
    // });
    let tweet = document.getElementById('tweet-textarea').innerText;
    console.log(tweet);
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
  postTweet();
});

// app.use((err, req, res, next) => {
//   res.locals.error = err;
//   res.status(err.status);
//   res.render("error");
// });

app.listen(3000, () => {
  console.log("Server is running on port: 3000 ");
});
