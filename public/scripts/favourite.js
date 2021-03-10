$(() => {

  setTimeout(() => {
    console.log('favourites is ready!');

    const favBtn = $('.favMap'); // Favourites button '<3'

    favBtn.on('click', (e) => {
      e.preventDefault();

      let thisBtn = $(e.target.parentElement);
      let mapID = thisBtn.siblings('.mapID').html();

      $.ajax({
        method: "POST",
        url: "/", // path to "add to favourites" route
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
  }, 100);

})


