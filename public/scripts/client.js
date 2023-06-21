$(document).ready(function() {
  const temporaryTestData =  [
    {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png",
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    }
  ];

  const createTweetElement = function(tweet) {
    // Build tweeter info in header
    const $tweeterInfo = $(`<div class="tweeter-info"><div><img src="${tweet["user"]["avatars"]}"></img></div><div class="tweeter-name">${tweet["user"]["name"]}</div></div>`).prop("outerHTML");
    const $handle = $(`<div class="handle">${tweet["user"]["handle"]}</div>`).prop("outerHTML");
    const $header = $(`<header>${$tweeterInfo}${$handle}</header>`).prop("outerHTML");
    const $body = $(`<div class="tweet-body">${tweet["content"]["text"]}</div>`).prop("outerHTML");
    const $timestamp = $(`<div class="date">${tweet["created_at"]}</div>`).prop("outerHTML");
    const $actions = $(`<div class="tweet-actions"><div class="flag"><i class="fa-solid fa-flag"></i></div><div class="retweet"><i class="fa-solid fa-retweet"></i></div><div class="like"><i class="fa-solid fa-heart"></i></div></div>`).prop("outerHTML");
    const $footer = $(`<footer>${$timestamp}${$actions}</footer>`).prop("outerHTML");
    const $tweet = $(`<article class="tweet">${$header}${$body}${$footer}</article>`);
    return $tweet;
  };

  const renderTweets = function (tweetDB) {
    for (const tweet of tweetDB) {
      const $tweet = createTweetElement(tweet);
      console.log($tweet);
      $('#tweets-container').append($tweet);
    }
  };

  // Test / driver code (temporary)
  renderTweets(temporaryTestData);
});


