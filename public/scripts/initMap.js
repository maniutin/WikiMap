function initMap() {
  setTimeout(() => {
    const mapID = $('#mapID').html();
    $.ajax({
      method: "GET",
      url: `/maps/${mapID}/initMap`
    })
    .done((data) => {
      // console.log("Got some data! ", data);
      // The location of start coordinates for map
      const startCoordinates = { lat: Number(data.startLat), lng: Number(data.startLng) };
      // The map, centered at start coordinates
      const map = new google.maps.Map(document.getElementById("map-viewport"), {
        zoom: 10,
        center: startCoordinates,
      });

      const windowArr = [];

      const findMarker = (marker) => {
        // console.log("Finding the latitude:", marker.position.lat());
        let markerLat = marker.position.lat();
        // console.log("Finding the longitude:", marker.position.lng());
        let markerLng = marker.position.lng();
        return { lat: markerLat, lng: markerLng };
      }

      const closeAllWindows = (windowArr) => {
        for (const marker of windowArr) {
          marker.close();
        }
      }

      // Place map data.points[i]s (markers) for this map, and set click listeners for each data.point
      for (let i = 0; i < data.points.length; i++) {
        let markerInfo;
        let position = { lat: Number(data.points[i].latitude), lng: Number(data.points[i].longitude) }
        let marker = new google.maps.Marker({
          position: position,
          map: map,
        });
        // Generate new info window for each of the marker positions
        markerInfo = new google.maps.InfoWindow({
          content: `<h4>${data.points[i].title}</h4>` +
                   `<div class='markerInfo'>` +
                   `<div class='imgContainer'><img style='width:100px;' src='${data.points[i].image ? data.points[i].image : 'https://images.unsplash.com/photo-1553547358-e8a4ee2dcfeb?ixid=MXwxMjA3fDB8MHxwaG90by1[…]VufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'}'></div>` +
                   `<div><b>${data.points[i].address}<br><br></b>` +
                   `<p>${data.points[i].descr}</p></div></div>`,
          position: position,
        });

        // push each infoWindow to an array to make closing all easier
        windowArr.push(markerInfo);

        // Click marker event
        marker.addListener("click", (e) => {
          closeAllWindows(windowArr);
          markerInfo.open(map);
          if (map.getZoom() < 12) {
            map.setZoom(12);
          }
        });

        // Get all img and h4 elements in the map points aside section by class
        let $markerImg = $('.markerImg');
        let $markerH4 = $('.markerH4');

        // Click handlers for each Image and Title in the scroll box of markers
        $markerImg[i].addEventListener("click", (e) => {
          $(document).scrollTop(50);
          closeAllWindows(windowArr);
          markerInfo.open(map);
        });
        $markerH4[i].addEventListener("click", (e) => {
          $(document).scrollTop(50);
          closeAllWindows(windowArr);
          markerInfo.open(map);
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







