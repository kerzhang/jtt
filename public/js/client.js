//Setup socket connection with server
const socket = io.connect("http://localhost:3000");

if (socket !== undefined) {
  console.log("socket connected ...");
}

//Handles the text input event from tweet text area.
$("#tweet-textarea").change(() => {
  let availableChar = 140 - $("#tweet-textarea").val().length;
  $("#tweet-char").text(availableChar);
});

$("#tweet-textarea").keydown(() => {
  let availableChar = 140 - $("#tweet-textarea").val().length;
  $("#tweet-char").text(availableChar);
});

//Handle the new tweet submit event
$(".button-primary").click(() => {
  //prevent the form submit event
  event.preventDefault();

  //validate the input text see if it is too long.
  let contentLength = $("#tweet-textarea").val().length;
  if (contentLength > 139) {
    alert("Tweet contents has to be less than 140 chars.");
  } else {
    //if the tweet is good to submit, grab the content and
    //construct a DOM item and then prepend it to the tweet list.  
    let $newTweetText = $("#tweet-textarea").val();
    let $screenName = $("#screenName").text();
    let $userName = $("#userName").text();
    let $avatar = $(".app--avatar").attr("style");

    let $tweet = `
          <li>
            <strong class="app--tweet--timestamp">Just Now</strong>
            <a class="app--tweet--author">
              <div class="app--avatar" style="${$avatar}">
                <img src="images/f-spore.png" />
              </div>
              <h4>${$userName}</h4> ${$screenName}
            </a>
            <p>${$newTweetText}</p>
            <ul class="app--tweet--actions circle--list--inline">
              <li>
                <a class="app--reply">
                  <span class="tooltip">Reply</span>
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 38 28" xml:space="preserve">
                    <path d="M24.9,10.5h-8.2V2.8c0-1.1-0.7-2.2-1.7-2.6c-1-0.4-2.2-0.2-3,0.6L0.8,12c-1.1,1.1-1.1,2.9,0,4L12,27.2
                    c0.5,0.5,1.2,0.8,2,0.8c0.4,0,0.7-0.1,1.1-0.2c1-0.4,1.7-1.5,1.7-2.6v-7.7h8.2c3.3,0,6,2.5,6,5.6v1.3c0,2,1.6,3.5,3.5,3.5
                    s3.5-1.6,3.5-3.5v-1.3C38,16.2,32.1,10.5,24.9,10.5z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a class="app--retweet">
                  <span class="tooltip">Retweet</span>
                  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 28" xml:space="preserve">
                    <path d="M25.2,22.4H13.1v-9.3h4.7c1.1,0,2.2-0.7,2.6-1.7c0.4-1,0.2-2.3-0.6-3.1l-7.5-7.5c-1.1-1.1-2.9-1.1-4,0L0.8,8.3
                    c-0.8,0.8-1,2-0.6,3.1c0.4,1,1.5,1.7,2.6,1.7h4.7v12.1c0,1.5,1.3,2.8,2.8,2.8h14.9c1.5,0,2.8-1.3,2.8-2.8
                    C28,23.7,26.7,22.4,25.2,22.4z"/>
                    <path d="M49.8,16.7c-0.4-1-1.5-1.7-2.6-1.7h-4.7V2.8c0-1.5-1.3-2.8-2.8-2.8H24.8C23.3,0,22,1.3,22,2.8s1.3,2.8,2.8,2.8h12.1v9.3
                    h-4.7c-1.1,0-2.2,0.7-2.6,1.7c-0.4,1-0.2,2.3,0.6,3.1l7.5,7.5c0.5,0.5,1.3,0.8,2,0.8c0.7,0,1.4-0.3,2-0.8l7.5-7.5
                    C50,18.9,50.2,17.7,49.8,16.7z"/>
                  </svg>
                  <strong>0</strong>
                </a>
              </li>
              <li>
                <a class="app--like">
                  <span class="tooltip">Like</span>
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 28" xml:space="preserve">
                    <path class="st0" d="M25.8,0c-3.6,0-6.8,2.1-8.3,5.1C16,2.1,12.9,0,9.2,0C4.1,0,0,4.1,0,9.2C0,21.4,17.3,28,17.3,28S35,21.3,35,9.2
                    C35,4.1,30.9,0,25.8,0L25.8,0z"/>
                  </svg>
                  <strong>0</strong>
                </a>
              </li>
            </ul>
          </li>
  `;
    $(".app--tweet--list").prepend($tweet);

    //clear the textarea contents
    $("#tweet-textarea").val("");
    //send the tweet text to io server to submit to twitter.com
    socket.emit("input", $newTweetText);
  }
});


//convert twitter timestamp
function timetowords(timestamp) {
  var tweet_date = new Date(Date.parse(timestamp));
  var user_date = new Date();
  var diff = Math.floor((user_date - tweet_date) / 1000);
  if (diff <= 20) {
    return "just now";
  }
  if (diff < 60) {
    return "less than a minute";
  }
  if (diff <= 90) {
    return "one minute";
  }
  if (diff <= 3540) {
    return Math.round(diff / 60) + " minutes";
  }
  if (diff <= 5400) {
    return "1 hour";
  }
  if (diff <= 86400) {
    return Math.round(diff / 3600) + " hours";
  }
  if (diff <= 129600) {
    return "1 day";
  }
  if (diff < 604800) {
    return Math.round(diff / 86400) + " days";
  }
  if (diff <= 777600) {
    return "1 week";
  }
  return "on " + tweet_date;
}

$(".app--tweet--timestamp").each(function() {
  let mesTime = $(this).text();
  let newTime = timetowords(mesTime);
  $(this).text(newTime);
});

$(".app--message--timestamp").each(function() {
  let mesTime = $(this).text();
  let newTime = timetowords(mesTime);
  $(this).text(newTime);
});
