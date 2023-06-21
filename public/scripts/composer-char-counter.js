$(document).ready(function() {
  $("textarea").on("input", function(event) {
    $(this).siblings("div")
            .children(".counter").val(140 - $(this).val().length);
  });
});