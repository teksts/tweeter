$(document).ready(function() {
  $("textarea").on("input", function(event) {
    const counter = $(this).siblings("div").children(".counter");
    const defaultColor = $("body").css("color");
    counter.val(140 - $(this).val().length);
    if (counter.val() < 0) {
      counter.css("color", "red");
    }
    if (counter.css("color") === "rgb(255, 0, 0)" && counter.val() > 0) {
      counter.css("color", defaultColor);
    }
  });
});