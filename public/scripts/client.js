// Wrap all client-side code in a $(document).ready() callback to ensure correct behaviour
$(document).ready(function() {

  // Correctly formats timestamps on tweets to show time since tweet created in a readable format
  const getTimePassed = function (timestamp) {
    return timeago.format(timestamp);
  };

  // Builds tweet elements out of tweet objects
  const createTweetElement = function(tweet) {
    const $tweeterInfo = $(`<div class="tweeter-info"><div><img src="${tweet["user"]["avatars"]}"></img></div><div class="tweeter-name">${tweet["user"]["name"]}</div></div>`).prop("outerHTML");
    const $handle = $(`<div class="handle">${tweet["user"]["handle"]}</div>`).prop("outerHTML");
    const $header = $(`<header>${$tweeterInfo}${$handle}</header>`).prop("outerHTML");
    // utilise .text when constructing tweet body to prevent XSS vulnerabilities
    const $body = $(`<div class="tweet-body"></div>`).text(tweet["content"]["text"]).prop("outerHTML");
    const $timestamp = $(`<div class="date">${getTimePassed(tweet["created_at"])}</div>`).prop("outerHTML");
    const $actions = $(`<div class="tweet-action-cluster"><div class="tweet-action"><i class="fa-solid fa-flag"></i></div><div class="tweet-action"><i class="fa-solid fa-retweet"></i></div><div class="tweet-action"><i class="fa-solid fa-heart"></i></div></div>`).prop("outerHTML");
    const $footer = $(`<footer>${$timestamp}${$actions}</footer>`).prop("outerHTML");
    const $tweet = $(`<article class="tweet">${$header}${$body}${$footer}</article>`);
    return $tweet;
  };

  // Builds the error banner
  const createErrorElement = function() {
    const $errorSymbol = $(`<div class="error-symbol"><i class="fa-solid fa-skull-crossbones fa-xl"></i></div>`).prop("outerHTML");
    const $errorTitle = $(`<div class="error-msg-title">HOLD ON SAILOR!</div>`).prop("outerHTML");
    const $errorBody = $(`<div class="error-msg-body"></div>`).prop("outerHTML");
    const $errorMsg = $(`<div class="error-msg">${$errorTitle}${$errorBody}</div>`).prop("outerHTML");
    const $errorPopup = $(`<section class="invalid-tweet-error">${$errorSymbol}${$errorMsg}${$errorSymbol}</section>`);
    $("main").prepend($errorPopup);
  }

  // Populates error banner with appropriate error message and insert into the DOM at the appropriate location
  const renderError = function(msg) {
    $errorPopup = $(".invalid-tweet-error");
    $errorBody = $(".error-msg-body");
    $errorBody.html(msg);
    $errorPopup.slideDown("slow", function () {
      $(this).css("display", "flex");
    });
  };

  // Inserts tweet feed into DOM
  const renderTweets = function (tweetDB) {
    // if tweet feed already loaded, only render new tweet
    if ($("#tweets-container").data("loaded")) {
      const newTweet = tweetDB.reverse()[0];
      const $newTweet = createTweetElement(newTweet);
      $('#tweets-container').prepend($newTweet);
    // if tweet feed unloaded, render all tweets
    } else {
      for (const tweet of tweetDB.reverse()) {
        const $tweet = createTweetElement(tweet);
        $('#tweets-container').append($tweet);
        $("#tweets-container").data("loaded", true);
      }
    }
  };
  
  // Feeds tweet database into renderTweets() using AJAX to avoid page reloads
  const loadTweets = function () {
    $.ajax({
      method: "GET",
      url: "/tweets",
    })
    .then((tweetDb) => {
      renderTweets(tweetDb);
    })
  };

  // Insert hidden, empty error banner
  createErrorElement();

  // set flag for initial composer display state
  $(".new-tweet").data("collapsed", true);

  // set flag marking if tweet feed has been loaded
  $("#tweets-container").data("loaded", false);

  // on-click handler for new tweet composer expansion
  $(".nav-right-side").on("click", function () {
    // initialize target DOM elements
    const $newTweetSection = $(this).parents("body").children("main").children(".new-tweet");
    const $newTweetTextArea = $($newTweetSection).children().children("textarea");
    // if collapsed, expanded and adjust flag
    if ($newTweetSection.data("collapsed")) {
      $($newTweetSection).slideDown("slow", function () {
        $newTweetSection.data("collapsed", false);
        $($newTweetTextArea).focus();
      });
    }
    // if expanded, collapse and adjust flag
    else {
      $($newTweetSection).slideUp("slow", function () {
        $newTweetSection.data("collapsed", true);
      });
    }
  });

  // on-submit handler for new tweet creation
  $("form").on("submit", function (event) {
    // bloc default behaviour to ensure data is only posted if input has been validated
    event.preventDefault();
    const data = $(this).serialize();
    const formContent = $(this).children("#tweet-text").val();
    const overLimit = $(this).children("div")
      .children(".counter")
      .data("overLimit");
    const $errorPopup = $(this).parents("main").children(".invalid-tweet-error")
    const emptyTweetMsg = "You forgot to write something!";
    const overLimitMsg = "Too wordy! Tweets have to be 140 characters or less.";
    // if error is showing, slide up banner (to be slid down again later pending validation)
    $errorPopup.slideUp(() => {
      // block submission and display error if tweet empty
      if (!formContent) {
        renderError(emptyTweetMsg);
      // block submission and display error if tweet too large
      } else if (overLimit) {
        renderError(overLimitMsg);
      // tweet is valid, post to server and update tweet feed
      } else {
        $.ajax({
          method: "POST",
          url: "/tweets",
          data
        })
          .then(() => {
            this.reset();
            loadTweets();
          });
      }
    });
  });

});

