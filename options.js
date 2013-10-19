var options = {
  consumerKey: '90a6162fd9204878aa8d5320d5b73ffc',
  consumerSecret: 'cd36914ccb97466c82d8a372a3e71640',

  requestTokenUrl: 'http://api.fitbit.com/oauth/request_token',
  accessTokenUrl: 'http://api.fitbit.com/oauth/access_token',
};

var oauth = OAuth(options);

function toggle_login(toggle) {
  if (toggle) {
    document.querySelector('#auth_controls').style.display = "block";
    document.querySelector('#unauth_controls').style.display = "none";
  } else {
    document.querySelector('#auth_controls').style.display = "none";
    document.querySelector('#unauth_controls').style.display = "block";
  }
}

// Fetch request token by redirecting user
function auth(e) {
  e.preventDefault();

  oauth.fetchRequestToken(function (url) {
    chrome.tabs.create({url: "http://www.fitbit.com/oauth/authorize" + url});
 });
}

function logout(e) {
  e.preventDefault();

  localStorage.clear();

  oauth = OAuth(options);

  toggle_login(true);
}

function save_pin() {
  var pin = document.getElementById("fitbit_pin_input").value;

  oauth.setVerifier(pin);
  oauth.fetchAccessToken(function success() {
    var access_token = oauth.getAccessToken();
    localStorage['oauth_access_token_key'] = access_token[0];
    localStorage['oauth_access_token_secret'] = access_token[1];

    toggle_login(false);

    fetch_goal();
    fetch_yesterday_activity();
  }, function fail() {
    console.log("Failed to fetch access token :-/");
  });
}

function fetch_goal() {
   if (localStorage['step_goal'] !== undefined) {
    return;
  }

  oauth.get('http://api.fitbit.com/1/user/-/activities/goals/daily.json', function (data) {
    var step_goal = JSON.parse(data.text).goals.steps;
    if (step_goal !== undefined) {
      localStorage["step_goal"] = step_goal;
    }
  });
}

function fetch_yesterday_activity() {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  var dateStr = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

  if (localStorage["steps_" + dateStr] !== undefined) {
    return;
  }

  oauth.get('http://api.fitbit.com/1/user/-/activities/date/' + dateStr + '.json', function (data) {
    var json = JSON.parse(data.text);
    var steps = json.summary.steps;

    localStorage["steps_" + dateStr] = steps;
    console.log("Got steps yesterday: " + json);
  });
}

function start() {
  var access_token_key = localStorage['oauth_access_token_key'];
  var access_token_secret = localStorage['oauth_access_token_secret'];

  if (access_token_key !== undefined && access_token_secret !== undefined) {
    toggle_login(false);
    oauth.setAccessToken(access_token_key, access_token_secret);

    fetch_goal();
    fetch_yesterday_activity();
  } else {
    toggle_login(true);
  }
}

document.querySelector('#save_pin').addEventListener('click', save_pin);
document.querySelector('#auth_button').addEventListener('click', auth);
document.querySelector('#unauth_button').addEventListener('click', logout);

document.addEventListener('DOMContentLoaded', start);
