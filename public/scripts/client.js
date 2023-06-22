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
    $errorBody = $(".error-msg-body");
    $errorBody.html(msg);
    $errorPopup.slideDown("slow", function () {
      $(this).css("display", "flex");
    });
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

  // set flag for initial section state
  $(".new-tweet").data("collapsed", true);

  // on-click handler for new-tweet expansion
  $(".nav-right-side").on("click", function () {
    // initialize target DOM elements
    const $newTweetSection = $(this).parents("body").children("main").children(".new-tweet");
    console.log($($newTweetSection).children().children("textarea"));
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

