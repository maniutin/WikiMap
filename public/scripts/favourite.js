$(() => {

  setTimeout(() => {
    console.log('favourites is ready!');

    const favBtn = $('.favMap'); // Favourites button '<3'
    const isUser = $('.userID').html();

    favBtn.on('click', (e) => {
      e.preventDefault();

      let thisBtn = $(e.target.parentElement);
      let mapID = thisBtn.parent().siblings('.mapID').html();
      let classes = Object.values(thisBtn[0].classList);
      console.log('mapID: ', mapID);

      if (!classes.includes('favourited')) {
        $.ajax({
          method: "POST",
          url: `/users/${isUser}/favourites`, // path to "add to favourites" route
          data: { mapID: mapID }
        })
        .done(response => {
          console.log(response);
          // if there is a res from back-end the map will get favourited class
          thisBtn.addClass('favourited');
          alert("Map added to favourites!");
        })
        .fail(err => console.log(err));

        favBtn.blur();
      } else {
        favBtn.blur();
        alert('This map is already on your favourites list!');
      }


    });
  }, 100);

})


