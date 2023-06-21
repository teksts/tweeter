$(document).ready(function() {
  $("textarea").on("input", function(event) {
    const counter = $(this).siblings("div").children(".counter");
    const defaultColor = $("body").css("color");
    counter.val(140 - $(this).val().length);
    if (counter.val() < 0) {
      counter.css("color", "red");
      counter.data("overLimit", true);
    }
    if (counter.data("overLimit") === true && counter.val() > 0) {
      counter.css("color", defaultColor);
      counter.data("overLimit", false);
    }
  });
});