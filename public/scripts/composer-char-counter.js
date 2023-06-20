$(document).ready(function() {
  $("textarea").on("input", function(event) {
    console.log($(this).siblings("div")
                        .children(".counter").val(140 - $(this).val().length));
    // = 140 - $(this).val().length;
    // console.log(140 - $(this).val().length);
  });
});