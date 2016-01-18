var jsdom = require("jsdom");
var url_base = "www.azlyrics.com";

var getURL = function(artist_name) {
  artist_name = artist_name.replace(/&/, "").toLowerCase().split(" ").join("");
  var first_letter = artist_name[0];
  var url = `http://${url_base}/${first_letter}/${artist_name}.html`;
  console.log("Url:", url);
  return url;
}

var getSongURL = function(partial) {
  partial = partial.split("../")[1];
  return `http://${url_base}/${partial}`
}

module.exports = function lookup(artist_name, callback) {
  jsdom.env(getURL(artist_name),
    ["http://code.jquery.com/jquery.js"],
    (err, window) => {
      if (err) {
        return callback(err);
      }

      var song_links = window.$("a[href^='../lyrics']");
      var count = song_links.length;
      var completed = [];
      var urls = [];
      for (var i = 0; i < count; i++) {
        urls.push(getSongURL(window.$(song_links[i]).attr('href')));
      }

      var handler = (err, result) => {
        if (err) {
          completed.push["error"]
        } else {
          completed.push(result);
        }

        if (urls.length === 0) {
          callback(null, completed);
        } else {
          console.log("Loaded " + completed.length + " out of " + count + " songs.");
          load_song(urls.pop(), handler)
        }
      }

      load_song(urls.pop(), handler);
    })
}

function load_song(url, callback) {
  jsdom.env(url, ["http://code.jquery.com/jquery.js"], (err, window) => {
    if (err) { return callback(err); }
    var div_share = window.$('.div-share:not(.noprint)')
    var song_title = div_share.text().split(' lyrics')[0];
    song_title = song_title.substr(1, song_title.length - 2);

    var song_lyrics = window.$('.ringtone').next().next().next().next().text();
    song_lyrics = song_lyrics.substr(2, song_lyrics.length - 3);

    var album_details = window.$('.album-panel a').text();

    var album = album_details.substr(1, album_details.length - 9)
    var year = album_details.substr(-5).substr(0, 4);
    callback(null, {album: album, year: year, title: song_title, lyrics: song_lyrics});
  })
}