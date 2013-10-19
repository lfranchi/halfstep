function start() {
  chrome.runtime.sendMessage({type: "data"}, function(response) {
  // console.log("GOT:");
  var percent_succeeded = response.percent_succeeded;
  if (percent_succeeded === undefined || percent_succeeded < 0) {
    percent_succeeded = 100;
  } else {
    percent_succeeded = 100 * percent_succeeded;
  }

  var capped = percent_succeeded > 100 ? 100 : percent_succeeded;
  document.querySelector('#percent_of_song').innerHTML = capped;

  var progressbar_color, heckle_text;
  if (percent_succeeded < 40) {
    if (percent_succeeded < 20) {
      heckle_text = "a corpse";
    } else {
      heckle_text = "a slacker";
    }
    progressbar_color = "progress-bar-danger";
  } else if (percent_succeeded < 100) {
    if (percent_succeeded < 60) {
      heckle_text = "lost in the house";
    } else if (percent_succeeded < 90){
      heckle_text = "almost respectable";
    } else {
      heckle_text = "a productive human";
    }

    progressbar_color = "progress-bar-warning";
  } else if (percent_succeeded < 120) {
    heckle_text = "a beast!";
    progressbar_color = "progress-bar-success";
  } else {
    heckle_text = "a beast!";
    progressbar_color = "progress-bar-info";
  }

  document.querySelector('#progress_bar_walk').classList.add(progressbar_color);
  document.querySelector('#progress_bar_walk').setAttribute("aria-valuenow", "" + Math.floor(percent_succeeded));
  document.querySelector('#progress_bar_walk').setAttribute("style", "width: " + Math.floor(percent_succeeded) + "%");
  document.querySelector('#heckle_text').innerHTML = heckle_text;

  });

}

document.addEventListener('DOMContentLoaded', start);
