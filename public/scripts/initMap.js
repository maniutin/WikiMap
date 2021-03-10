function initMap() {
  setTimeout(() => {
    const mapID = $('#mapID').html();
    $.ajax({
      method: "GET",
      url: `/maps/${mapID}/initMap`
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
      // Place map points (markers) for this map, and set click listeners for each point
      for (const point of data.points) {
        let markerInfo;
        let position = { lat: Number(point.latitude), lng: Number(point.longitude) }
        let marker = new google.maps.Marker({
          position: position,
          map: map,
        });
        marker.addListener("click", (e) => {
          markerInfo = new google.maps.InfoWindow({
            content: `${point.title} @ ${point.address}`,
            position: position,
          });
          markerInfo.open(map);
          map.setZoom(13);
          map.setCenter(marker.getPosition());
        });

      }
      // Create the initial InfoWindow.
      let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to find a location!",
        position: startCoordinates,
      });
      infoWindow.open(map);
      // Configure the click listener.
      map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        let coords = `${mapsMouseEvent.latLng.lat()},${mapsMouseEvent.latLng.lng()}`;
        console.log(coords);
        // Call server to request a Reverse geocode to get address
        $.ajax({
          method: "GET",
          url: `/maps/${mapID}/getAddress`,
          data: { coords: coords }
        })
        .done(address => {
          // Create a new InfoWindow.
          infoWindow = new google.maps.InfoWindow({ position: mapsMouseEvent.latLng });
          infoWindow.setContent(address);
          infoWindow.open(map);
          // Update the address input element in form
          $('#location').val(address);
          console.log(address);
        })
        .fail(function(error) {
          console.log("Reverse Geocode Error: ", error);
        })
        .always()

      });

    })
    .fail(function(error) {
      console.log("AJAX Error from server: ", error);
    })
    .always(function() {
      console.log("AJAX GET mapID from server completed.");
    });
  }, 100);

};







