function find_song_duration(title, artist, cb) {
  var url = "http://developer.echonest.com/api/v4/song/search?api_key=DD9P0OV9OYFH1LCAE&format=json&results=1&artist=" + artist + "&title=" + title + "&bucket=audio_summary";
  var xhr = new XMLHttpRequest();
  var d;
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(this.responseText);
      cb(this.responseText);
    }
  }; // Implemented elsewhere.
  xhr.open("GET", url, true);
  xhr.send();
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var step_goal = localStorage['step_goal'];

	  var date = new Date();
	  date.setDate(date.getDate() - 1);
	  var dateStr = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	  var steps_yesterday = localStorage['steps_' + dateStr];

    var percent_succeeded = steps_yesterday / step_goal;
    var percent_succeeded = 0.05; // TESTING


    if (request.type === "data") {
      sendResponse({step_goal: step_goal,
				      steps_yesterday: steps_yesterday,
                    percent_succeeded: percent_succeeded});
    } else if(request.type === "song") {
      find_song_duration(request.title, request.artist, function(data) {
        // sendResponse({data: data});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {type: "songdata", data: data}, function(response) {
            console.log(response.farewell);
          });
        });
      });
    }
  });
