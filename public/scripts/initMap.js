// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/maps"
//   })
//   .done((data) => {
//     console.log("Got some data! ", data);
//   })
//   .fail(function(error) {
//     console.log("Error: ", error);
//   })
//   .always(function() {
//     console.log("AJAX GET mapID from server completed.");
//   });
// });


// Initialize and add the map
function initMap() {
  // The location of Uluru
  const uluru = { lat: -25.344, lng: 131.036 };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map-viewport"), {
    zoom: 4,
    center: uluru,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
};