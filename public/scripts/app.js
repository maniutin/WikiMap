$(() => {
  setTimeout(() => {
    console.log('app.js is ready!');

    // const map = $('#map-viewport');
    const mapID = $('#mapID').html();
    const favBtn = $('.favMap'); // Favourites button '<3'
    const locBtn = $('.addLoc'); // button for 'Add Location'
    const userName = $('#userName').html(); // hidden p tag containing current user
    const userID = $('#userID').html(); // hidden p tag containing current user

    favBtn.on('click', (e) => {
      e.preventDefault();

      let classes = Object.values(favBtn[0].classList);
      if (userID && userName) {
        if (!classes.includes('favourited')) {
          $.ajax({
            method: "POST",
            url: `/users/${userID}/favourites`,
            data: { mapID: mapID }
          })
          .done(response => {
            isFav = true; // ensures you can't click favourite twice
            console.log(response);
            favBtn.addClass('favourited');
            alert("Map added to favourites!");
          })
          .fail(err => console.log(err));

          favBtn.blur();
        } else {
          favBtn.blur();
          alert('This map was already added to your favourites!');
        }
      } else {
        favBtn.blur();
        alert('You must be logged in to favourite a map!');
      }

    });


    locBtn.on("click", function(event) {

      const $addLocation = $('#addLocation');

      if (userName) {
        console.log(userName);
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
