function extractUrl(input) {
  // remove quotes and wrapping url()
  if (typeof input !== "undefined") {
   return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
  } else {
   return;
  }
}

function get_current_song() {
  var active;
  if($('.haarp-active.section-track').length > 0) {
    active = $('.haarp-active.section-track');
  } else {
    active = $($('.section-track')[0]);
  }

  var thisArtist = $($('#player-nowplaying a')[3]).text(),
      thisSong = $($('#player-nowplaying a')[4]).text(),
      thisImage = extractUrl(active.find('.readpost > span').css('background-image')),
      thisPerma = window.location.origin + active.find('a.track').attr('href');

  return {song: thisSong, artist: thisArtist};
}

$('.haarp-play-ctrl.icon-toggle').click(function (ev) {
  var was_playing = !$(ev.target).hasClass('play');
  if (!was_playing) {
    song_started();
  } else {
    song_paused();
  }
});

$('#playerPlay').click(function (ev) {
  var was_playing = $(ev.target).hasClass('play');
  if (!was_playing) {
    song_started();
  } else {
    song_paused();
  }
});

function song_started() {
  setTimeout(function () {
    var song = get_current_song();
    console.log("Playing: " + JSON.stringify(song));
    chrome.runtime.sendMessage({type: "song", title: song.song, artist: song.artist});
  }, 0);
}


var timer;
function song_paused() {
  if (timer !== undefined) {
    clearTimeout(timer);
  }
}

function song_data_callback() {
  if (this_song_cutoff === undefined) {
    return;
  }

  timer = setTimeout(function HAHAHA() {
    console.log("Walk faster!");
    // $('#playerNext').click();
    document.querySelector('#playerNext').click();
    heckle_user();

    // Check again after the song has loaded
    setTimeout(song_started, 2000);

  }, this_song_cutoff * 1000);
}