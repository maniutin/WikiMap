$(document).ready(function() {
  // $.ajax({
  //   method: "GET",
  //   url: "http/localhost:8080/users/1/favourites"
  // })
  // .done((data) => {
  //   console.log(data)
  // })




  $("#my-maps").on("click", () => {
    const $myMaps = $(this).find("#owner-maps-container");
    const $favouriteMaps = $(this).find("#favourite-maps-container")
    const $contributionMaps = $(this).find("#contribution-maps-container")
    $myMaps.addClass("show");
    $myMaps.removeClass("hide");
    $favouriteMaps.addClass("hide");
    $favouriteMaps.removeClass("show");
    $contributionMaps.addClass("hide");
    $contributionMaps.removeClass("show");
  })
  $("#my-favourites").on("click", () => {
    const $myMaps = $(this).find("#owner-maps-container");
    const $favouriteMaps = $(this).find("#favourite-maps-container")
    const $contributionMaps = $(this).find("#contribution-maps-container")
    $myMaps.addClass("hide");
    $myMaps.removeClass("show");
    $favouriteMaps.addClass("show");
    $favouriteMaps.removeClass("hide");
    $contributionMaps.addClass("hide");
    $contributionMaps.removeClass("show");
  })
  $("#my-contributions").on("click", () => {
    const $myMaps = $(this).find("#owner-maps-container");
    const $favouriteMaps = $(this).find("#favourite-maps-container")
    const $contributionMaps = $(this).find("#contribution-maps-container")
    $myMaps.addClass("hide");
    $myMaps.removeClass("show");
    $favouriteMaps.addClass("hide");
    $favouriteMaps.removeClass("show");
    $contributionMaps.addClass("show");
    $contributionMaps.removeClass("hide");
  })
});
