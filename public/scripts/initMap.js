function initMap() {
  setTimeout(() => {
    const mapID = $('#mapID').html();
    $.ajax({
      method: "GET",
      url: `/maps/${mapID}/start_coordinates`
    })
    .done((data) => {
      console.log("Got some data! ", data);
      // The location of start coordinates for map
      const startCoordinates = { lat: Number(data.startLat), lng: Number(data.startLng) };
      // The map, centered at start coordinates
      const map = new google.maps.Map(document.getElementById("map-viewport"), {
        zoom: 8,
        center: startCoordinates,
      });
      // The map points (markers) for this map, from the database
      for (const point of data.points) {
        console.log(point);
        let marker = new google.maps.Marker({
          position: { lat: Number(point.latitude), lng: Number(point.longitude) },
          map: map,
        });
      }
      // Start coordinates - from original map
      const marker = new google.maps.Marker({
        position: startCoordinates,
        map: map,
      });

    })
    .fail(function(error) {
      console.log("Error: ", error);
    })
    .always(function() {
      console.log("AJAX GET mapID from server completed.");
    });
  }, 100);

};







