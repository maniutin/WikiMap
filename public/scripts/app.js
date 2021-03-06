$(() => {
  setTimeout(() => {
    console.log("app.js is ready!");

    // const map = $('#map-viewport');
    const mapID = $("#mapID").html();
    const favBtn = $(".favMap"); // Favourites button '<3'
    const locBtn = $(".addLoc"); // button for 'Add Location'
    const userName = $("#userName").html(); // hidden p tag containing current user
    const userID = $("#userID").html(); // hidden p tag containing current user
    const pointEditBtn = $(".edit-point-btn"); // edit point button
    const submitEditPointBtn = $(".edit-point");

    favBtn.on("click", (e) => {
      e.preventDefault();

      let classes = Object.values(favBtn[0].classList);
      if (userID && userName) {
        if (!classes.includes("favourited")) {
          $.ajax({
            method: "POST",
            url: `/users/${userID}/favourites`,
            data: { mapID: mapID },
          })
            .done((response) => {
              isFav = true; // ensures you can't click favourite twice
              console.log(response);
              favBtn.addClass("favourited");
              alert("Map added to favourites!");
            })
            .fail((err) => console.log(err));

          favBtn.blur();
        } else {
          favBtn.blur();
          alert("This map was already added to your favourites!");
        }
      } else {
        favBtn.blur();
        alert("You must be logged in to favourite a map!");
      }
    });

    locBtn.on("click", function (event) {
      const $addLocation = $("#addLocation");

      if (userName) {
        console.log(userName);
        $addLocation.slideToggle({
          duration: 400,
          start: function () {
            $(this).css("display", "flex");
          },
        });
        $("#location").focus();
      } else {
        alert("You must be a registered user to contribute to a map!");
      }
    });

    pointEditBtn.on("click", function (event) {
      const $editPoint = $(this).siblings(".edit-point-form");

      // Grab current details
      let $title = $(this).parents('.markerTd').find('.markerH4').html();
      let $address = $(this).parents('.markerTd').find('.markerAddress').html();
      let $desc = $(this).parents('.markerTd').find('.markerDesc').html();

      // Autofill edit form from current data
      $(this).siblings('div.location-form').find('.address-field').val($address);
      $(this).siblings('div.location-form').find('.title-field').val($title);
      $(this).siblings('div.location-form').find('.description-field').val($desc);

      if (userName) {
        console.log(userName);
        $editPoint.slideToggle({
          duration: 400,
          start: function () {
            $(this).css("display", "flex");
          },
        });
      } else {
        alert("You must be a registered user to contribute to a map!");
      }
    });

    submitEditPointBtn.on("click", function (event) {
      const $editPointBtn = $(this);
      const data = {
        address: $editPointBtn.siblings(".address-field").val(),
        title: $editPointBtn.siblings(".title-field").val(),
        description: $editPointBtn.siblings(".description-field").val(),
      };
      $.ajax({
        url: `/maps/edit/${$editPointBtn.data(
          "mapId"
        )}/points/${$editPointBtn.data("pointId")}`,
        type: "POST",
        data: data,
        success: function (result) {
          window.location.reload();
        },
        error: function (err) {
          console.log("ERROR");
        },
      });
    });
  }, 100);
});
