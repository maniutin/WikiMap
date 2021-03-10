$(document).ready(function() {
  $("#my-maps").on("click", () => {
    const $myMaps = $(this).find("#owner-maps-container");
    const $contributionMaps = $(this).find("#contribution-maps-container")
    console.log($myMaps)
    $myMaps.addClass("show");
    $myMaps.removeClass("hide");
    $contributionMaps.addClass("hide");
    $contributionMaps.removeClass("show");
  })
  $("#my-contributions").on("click", () => {
    const $myMaps = $(this).find("#owner-maps-container");
    const $contributionMaps = $(this).find("#contribution-maps-container")
    console.log($myMaps)
    $myMaps.addClass("hide");
    $myMaps.removeClass("show");
    $contributionMaps.addClass("show");
    $contributionMaps.removeClass("hide");
  })
});
