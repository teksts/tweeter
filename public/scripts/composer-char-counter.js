// Wrap in $(document).ready() to ensure code only executes when DOM structure is ready to be traversed
$(document).ready(function() {
  // on-input handler for compose new tweet text field
  $("textarea").on("input", function(event) {
    const counter = $(this).siblings("div").children(".counter");
    const defaultColor = $("body").css("color");
    // update value of the counter upon each input to reflect tweet length
    counter.val(140 - $(this).val().length);
    // adjust counter color if limit exceeded
    if (counter.val() < 0) {
      counter.css("color", "red");
      counter.data("overLimit", true);
    }
    // reset counter color of brought back under limit
    if (counter.data("overLimit") === true && counter.val() > 0) {
      counter.css("color", defaultColor);
      counter.data("overLimit", false);
    }
  });
});