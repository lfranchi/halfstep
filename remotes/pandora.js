function get_current_song() {
  var thisSong = $('.playerBarSong').text(),
      thisArtist = $('.playerBarArtist').text(),
      thisImage = $('.playerBarArt').prop('src');

  return {title: thisSong, artist: thisArtist};
}

function play_started() {
  console.log("CHecking...");
  // Check to make sure it is playing
  if ($("#playbackControl .playButton").is(":visible")) {
    return;
  }

  setTimeout(function () {
    var song = get_current_song();
    console.log("Playing: " + JSON.stringify(song));
    if (song.title === '' || song.artist === '') {
      return;
    }

    chrome.runtime.sendMessage({type: "song", title: song.title, artist: song.artist});
  }, 0);
}

$("#playbackControl .playButton").click(function () {
  setTimeout(play_started, 1000);
});

$("#playbackControl .pauseButton").click(function () {

});

$("#playbackControl .skipButton").click(function () {

});

setTimeout(play_started, 6000);


function song_data_callback() {
  if (this_song_cutoff === undefined) {
    return;
  }

  timer = setTimeout(function HAHAHA() {
    console.log("Walk faster!");
    document.querySelector('.skipButton a').click();
    heckle_user();

    // Check again after the song has loaded
    setTimeout(play_started, 2000);

  }, this_song_cutoff * 1000);
}