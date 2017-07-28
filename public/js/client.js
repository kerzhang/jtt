function timetowords(timestamp) {
	  var tweet_date = new Date(Date.parse(timestamp));
    var user_date = new Date();
    var diff = Math.floor((user_date - tweet_date) / 1000);
    if (diff <= 20) {return "just now";}
    if (diff < 60) {return "less than a minute";}
    if (diff <= 90) {return "one minute";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes";}
    if (diff <= 5400) {return "1 hour";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours";}
    if (diff <= 129600) {return "1 day";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days";}
    if (diff <= 777600) {return "1 week";}
    return "on " + tweet_date;
}

$('.app--tweet--timestamp').each( function() {
  let mesTime = $(this).text();
  let newTime = timetowords(mesTime);
  $(this).text(newTime);
})

$('.app--message--timestamp').each( function() {
  let mesTime = $(this).text();
  let newTime = timetowords(mesTime);
  $(this).text(newTime);
})
