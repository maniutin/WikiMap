$(document).ready(function() {
  // $.ajax({
  //   method: "GET",
  //   url: "http/localhost:8080/users/1/favourites"
  // })
  // .done((data) => {
  //   console.log(data)
  // })


  const $myMaps = $("#owner-maps-container");
  const $favouriteMaps = $("#favourite-maps-container");
  const $contributionMaps = $("#contribution-maps-container");


  $("#my-maps").on("click", () => {
    $myMaps.addClass("show");
    $myMaps.removeClass("hide");
    $favouriteMaps.addClass("hide");
    $favouriteMaps.removeClass("show");
    $contributionMaps.addClass("hide");
    $contributionMaps.removeClass("show");
  })
  $("#my-favourites").on("click", () => {
    $myMaps.addClass("hide");
    $myMaps.removeClass("show");
    $favouriteMaps.addClass("show");
    $favouriteMaps.removeClass("hide");
    $contributionMaps.addClass("hide");
    $contributionMaps.removeClass("show");
  })
  $("#my-contributions").on("click", () => {
    $myMaps.addClass("hide");
    $myMaps.removeClass("show");
    $favouriteMaps.addClass("hide");
    $favouriteMaps.removeClass("show");
    $contributionMaps.addClass("show");
    $contributionMaps.removeClass("hide");
  })
});
