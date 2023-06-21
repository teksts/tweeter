$(document).ready(function() {
  
  const getTimePassed = function (timestamp) {
    return timeago.format(timestamp);
  };

  const createTweetElement = function(tweet) {
    // Build tweeter info in header
    const $tweeterInfo = $(`<div class="tweeter-info"><div><img src="${tweet["user"]["avatars"]}"></img></div><div class="tweeter-name">${tweet["user"]["name"]}</div></div>`).prop("outerHTML");
    const $handle = $(`<div class="handle">${tweet["user"]["handle"]}</div>`).prop("outerHTML");
    const $header = $(`<header>${$tweeterInfo}${$handle}</header>`).prop("outerHTML");
    const $body = $(`<div class="tweet-body"></div>`).text(tweet["content"]["text"]).prop("outerHTML");
    const $timestamp = $(`<div class="date">${getTimePassed(tweet["created_at"])}</div>`).prop("outerHTML");
    const $actions = $(`<div class="tweet-action-cluster"><div class="tweet-action"><i class="fa-solid fa-flag"></i></div><div class="tweet-action"><i class="fa-solid fa-retweet"></i></div><div class="tweet-action"><i class="fa-solid fa-heart"></i></div></div>`).prop("outerHTML");
    const $footer = $(`<footer>${$timestamp}${$actions}</footer>`).prop("outerHTML");
    const $tweet = $(`<article class="tweet">${$header}${$body}${$footer}</article>`);
    return $tweet;
  };

  const createErrorElement = function() {
    const $errorSymbol = $(`<div class="error-symbol"><i class="fa-solid fa-skull-crossbones fa-xl"></i></div>`).prop("outerHTML");
    const $errorTitle = $(`<div class="error-msg-title">HOLD ON SAILOR!</div>`).prop("outerHTML");
    const $errorBody = $(`<div class="error-msg-body"></div>`).prop("outerHTML");
    const $errorMsg = $(`<div class="error-msg">${$errorTitle}${$errorBody}</div>`).prop("outerHTML");
    const $errorPopup = $(`<section class="invalid-tweet-error">${$errorSymbol}${$errorMsg}${$errorSymbol}</section>`);
    $("main").prepend($errorPopup);
  }

  const renderError = function(msg) {
    $errorPopup = $(".invalid-tweet-error");
    console.log($errorPopup)
    $errorBody = $(".error-msg-body");
    console.log($errorBody.prop("outerHTML"));
    $errorBody.html(msg);
    $errorPopup.slideDown();
  };

  const renderTweets = function (tweetDB) {
    for (const tweet of tweetDB.reverse()) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    }
  };

  const loadTweets = function () {
    $.ajax({
      method: "GET",
      url: "/tweets",
    })
    .then((tweetDb) => {
      renderTweets(tweetDb);
    })
  };

  createErrorElement();

  $("form").on("submit", function (event) {
    event.preventDefault();
    const data = $(this).serialize();
    const formContent = $(this).children("#tweet-text").val();
    const overLimit = $(this).children("div")
      .children(".counter")
      .data("overLimit");
    const $errorPopup = $(this).parents("main").children(".invalid-tweet-error")
    const emptyTweetMsg = "You forgot to write something!";
    const overLimitMsg = "Too wordy! Tweets have to be 140 characters or less.";
    if ($errorPopup.css("display") !== "none") {
      $errorPopup.slideUp();
    }
    if (!formContent) {
      renderError(emptyTweetMsg);
    } else if (overLimit) {
      renderError(overLimitMsg);
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


