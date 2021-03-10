$(() => {
  setTimeout(() => {
    console.log('app.js is ready!');

    const map = $('#map-viewport');
    const mapID = $('#mapID').html();
    const favBtn = $('.favMap'); // Favourites button '<3'
    const locBtn = $('.addLoc'); // button for 'Add Location'
    const isUser = $('#userID').html(); // hidden p tag containing current user

    favBtn.on('click', (e) => {
      e.preventDefault();

      $.ajax({
        method: "POST",
        url: "/",
        data: { mapID: mapID }
      })
      .done(response => {
        console.log(response);
        //alert("Map added to favourites!");
      })
      .fail(err => console.log(err));

      favBtn.blur();
      alert("Map added to favourites!");
    });


    locBtn.on("click", function(event) {

      const $addLocation = $('#addLocation');

      if (isUser) {
        console.log(isUser);
        $addLocation.slideToggle({
          duration: 400,
          start: function() {
            $(this).css('display', 'flex');
          }
        });
        $('#location').focus();
      } else {
        alert("You must be a registered user to contribute to a map!");
      }

    });




  }, 100);
})
