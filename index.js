const Twit = require("twit");
const path = require("path");
const config = require("./config");
const express = require("express");
const bodyParser = require("body-parser");

//Setup socket.io server with express to get client message in real-time,
//because the proj required to add new tweet to list without refresh page.
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const T = new Twit(config);

let userName = "";
let userProfileImgUrl = "";
let backgroundImgUrl = "";
let myTweets;
let myFriends;
let myChats;
let friendsCount = 5;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");

//Load 5 tweets, 5 friends, 5 messages from twitter.com
//Assign the returned data to global varibles of this code
function loadTweetData() {
  T.get("friends/list", { screen_name: userName, count: 5 }, function(
    err,
    data,
    response
  ) {
    if (err) {
        // console.log(err);
        throw err;
    } else {
      myFriends = data.users;
      // console.log(data.users);
    }
  });

  T.get("direct_messages/sent", { count: 5 }, function(err, data, response) {
    if (err) {
        console.log(err);
    } else {
      myChats = data;
      // console.log(data);
    }
  });

  T.get("statuses/user_timeline", { screen_name: userName, count: 5 }, function(
    err,
    data,
    response
  ) {
    if (err) {
      console.log(err);
    } else {
      myTweets = data;
      // console.log(data);
    }
  });
}

//Verify user information, and load user data if passed.
T.get("account/verify_credentials", { skip_status: true })
  .catch(function(err) {
    console.log("caught error", err.stack);
  })
  .then(function(result) {
    userName = result.data.screen_name;
    userProfileImgUrl = result.data.profile_image_url_https;
    backgroundImgUrl = result.data.profile_banner_url;
    friendsCount = result.data.friends_count;
    // console.log(result.data);
    loadTweetData();
  });

//Receive the new tweet text from client and post it to Twitter
io.on("connection", function(socket) {
  console.log("Client connected ...");
  socket.on("input", msg => {
    T.post("statuses/update", { status: msg }, function(err, data, response) {
      if (err) {
        console.log(err);
      }
    });
    //Twitter response very slow sometimes, so wait for a while to load the updated data.
    setTimeout(function() {
      loadTweetData();
    }, 3000);
  });
});

//Home page
app.get("/", function(req, res) {
  res.render("index", {
    tweets: myTweets,
    friends: myFriends,
    chats: myChats,
    userProfileImgUrl: userProfileImgUrl,
    username: userName,
    backgroundImg: backgroundImgUrl,
    friendsCount: friendsCount
  });
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.render("error");
});

server.listen(3000, () => {
  console.log("Server is running on port: 3000 ");
});
