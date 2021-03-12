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

  // Profile navigation between "my maps"/"my favourites"/"my contributions"
  const $myMaps = $("#owner-maps-container");
  const $favouriteMaps = $("#favourite-maps-container");
  const $contributionMaps = $("#contribution-maps-container");

  $("#my-maps").on("click", (e) => {
    console.log($(this))
    if (!$("#my-maps").hasClass("active")) {
      $("#my-maps").addClass("active")
      $("#my-favourites").removeClass("active")
      $("#my-contributions").removeClass("active")
    }
    $myMaps.addClass("show");
    $myMaps.removeClass("hide");
    $favouriteMaps.addClass("hide");
    $favouriteMaps.removeClass("show");
    $contributionMaps.addClass("hide");
    $contributionMaps.removeClass("show");
  })

  $("#my-favourites").on("click", () => {
    console.log($(this))
    if (!$("#my-favourites").hasClass("active")) {
      $("#my-favourites").addClass("active")
      $("#my-maps").removeClass("active")
      $("#my-contributions").removeClass("active")
    }
    $myMaps.addClass("hide");
    $myMaps.removeClass("show");
    $favouriteMaps.addClass("show");
    $favouriteMaps.removeClass("hide");
    $contributionMaps.addClass("hide");
    $contributionMaps.removeClass("show");
  })

  $("#my-contributions").on("click", () => {
    console.log($(this))
    if (!$("#my-contributions").hasClass("active")) {
      $("#my-contributions").addClass("active")
      $("#my-maps").removeClass("active")
      $("#my-favourites").removeClass("active")
    }
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
    <div class="profile-map">
      <img src="${favouriteObj.map_image_url}" alt="${favouriteObj.title}" class="profile-map-img">
      <div class="profile-map-content">
        <header>
          <h5>${favouriteObj.title}</h5>
          <span>Category: </span>
          <small class="badge bg-info text-dark">
            ${favouriteObj.category}
          </small>
        </header>
        <p>${favouriteObj.description}</p>
      </div>
      <div class="profile-map-btns">
        <a class="btn btn-primary" href="/maps/${favouriteObj.map_id}">View</a>
        <button class="btn btn-danger remove-fav" value="${favouriteObj.map_id}">Remove Favourite</button>
      </div>
    </div>
  </div>`;
};
