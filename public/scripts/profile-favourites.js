$(document).ready(function() {

  const loadFavourites = (mapId) => {
    $.ajax({
      method: "POST",
      url: "/users/favourites/delete",
      data: { mapID: mapId }
    })
    .done((data) => {
      console.log(data);
      renderFavourites(data);
    })
    .fail((err) => {
      console.error(err);
    })
  };
  const $favouritesSection = $("#favourite-maps-container");
  $favouritesSection.on("click",(event) => {
    const mapId = event.target.value
    if (event.target.className === "btn btn-danger remove-fav") {
      event.preventDefault();
      console.log("favourite removed");
      $("#favourite-maps-container").empty();
      loadFavourites(mapId);
    }
  })


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


// Helpers
const renderFavourites = (favouriteObjs) => {
  console.log(favouriteObjs);
  let favourites = "";
  for (const favouriteObj of favouriteObjs) {
    console.log(favouriteObj);
    favourites += createFavouriteElement(favouriteObj);
  }
  $("#favourite-maps-container").append(favourites);
};

const createFavouriteElement = (favouriteObj) => {
  return `
  <div class="mb-3">
    <header>
      <h5>${favouriteObj.title}</h5>
      <span>Category: </span>
      <small class="badge bg-info text-dark">
        ${favouriteObj.category}
      </small>
    </header>
    <div class="profile-map">
      <img src="${favouriteObj.map_image_url}" alt="${favouriteObj.title}" class="profile-map-img">
      <div class="profile-map-content">
        ${favouriteObj.description}
      </div>
      <div class="profile-map-btns">
        <a class="btn btn-primary" href="/maps/${favouriteObj.map_id}">View</a>
        <button class="btn btn-danger remove-fav" value="${favouriteObj.map_id}">Remove Favourite</button>
      </div>
    </div>
  </div>`;
};
