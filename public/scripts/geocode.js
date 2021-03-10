$(() => {
  setTimeout(() => {
    // Set hover tooltip over favourites link
    // const favBtn = $('[data-toggle="tooltip"]')
    // favBtn.tooltip();

    $('#favMap').on('click', (e) => {
      e.preventDefault();
      console.log('FAVOURITED');
    });

    const map = $('#map-viewport');
    const mapID = $('#mapID').html();


  }, 0);
})
