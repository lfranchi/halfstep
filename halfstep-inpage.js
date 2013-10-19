var percent_to_play;
var this_song_cutoff;

chrome.runtime.sendMessage({type: "data"}, function(response) {
  // console.log("GOT:");
  // console.log(response);
  percent_to_play = response.percent_succeeded;
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "songdata") {
      var data = JSON.parse(request.data);
      var songs = data.response.songs;


      if (songs.length > 0) {
        var song_data = songs[0];
        var duration = song_data.audio_summary.duration;

        if (percent_to_play > 0 && percent_to_play < 1) {
          this_song_cutoff = duration * percent_to_play;
          console.log("Song is " + duration + " long but only playing " + this_song_cutoff);
        }

        if (typeof song_data_callback !== "undefined") {
          song_data_callback(song_data);
        }
      }
    }
  });

var heckle_messages = ['I hear that song has a great ending... too bad you missed it!',
                       "I love that chorus... you probably would too if you weren't so lazy",
                       "NEXT! Maybe that'll teach you to sit on your ass all day",
                       "Note from you doctor: try to get more exercise",
                       "I see you taping your Fitbit to the ceiling fan... REALLY?!",
                       "I'm doing this for your own good!"];

function heckle_user() {
  var idx = Math.floor(Math.random() * heckle_messages.length);
  var msg = heckle_messages[idx];

  var notification = webkitNotifications.createNotification(chrome.extension.getURL('images/icons/48.png'),
                                                            "Halfstep",
                                                            msg);
  notification.show();
}