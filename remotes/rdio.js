var known_playing = false;

function is_playing() {
	return $('.left_controls .play_pause').hasClass('playing');
}

function get_current_song() {
	return {artist: $('.text_metadata .artist_title').text(),
			title: $('.text_metadata .song_title').text()}
}

function song_started() {
	var song = get_current_song();
	console.log("Playing: " + JSON.stringify(song));
    chrome.runtime.sendMessage({type: "song", title: song.title, artist: song.artist});
}

function song_stopped() {
	console.log("Song Stpped");
}

setTimeout(function self() {
	if (!known_playing && is_playing()) {
		known_playing = true;

		song_started();
	} else if(known_playing && !is_playing()) {
		known_playing = false;

		song_stopped();
	}

	setTimeout(self, 500);
}, 500);


function song_data_callback() {
  timer = setTimeout(function HAHAHA() {
    console.log("Walk faster!");
    // $('#playerNext').click();
    document.querySelector('.next').click();
    heckle_user();

    // Check again after the song has loaded
    setTimeout(song_started, 2000);

  }, this_song_cutoff * 1000);
}