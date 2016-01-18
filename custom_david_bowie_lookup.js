var fs = require('fs');
var jsdom = require("jsdom");
var url_base = "www.davidbowie.com";

var getURL = function() {
  var url = `http://${url_base}/sound`;
  console.log("Url:", url);
  return url;
}

var getAlbumURL = function(partial) {
  return `http://${url_base}/${partial}`;
}

var getSongURL = function(partial) {
  partial = partial.split("../")[1];
  return `http://${url_base}/${partial}`
}

function lookup(callback) {
  jsdom.env(getURL(),
    ["http://code.jquery.com/jquery.js"],
    (err, window) => {
      if (err) {
        return callback(err);
      }

      var album_links = window.$("a[href^='/album/']");
      var count = album_links.length;
      var completed = [];
      var urls = [];
      for (var i = 0; i < count; i++) {
        urls.push(getAlbumURL(window.$(album_links[i]).attr('href')));
      }

      var handler = (err, result) => {
        if (err) {
          console.log("Error loading one particular url");
        } else {
          completed = completed.concat(result);
        }

        if (urls.length === 0) {
          callback(null, completed);
        } else {
          console.log("Loaded " + (count - urls.length) + " out of " + count + " albums.");
          load_album(urls.pop(), handler)
        }
      }

      load_album(urls.shift(), handler);
    })
}

function load_album(url, callback) {
  jsdom.env(url, ["http://code.jquery.com/jquery.js"], (err, window) => {
    if (err) { return callback(err); }
    var album_title = window.$('.album-title').text().trim();
    var album_year = window.$('.date-display-single').text().substr(-4);

    var rows = window.$('.views-row');
    output = [];
    for (var i = 0; i < rows.length; i++) {
      var song = extract_song(window.$(rows[i]));
      song.album = album_title;
      song.year = album_year;

      output.push(song);
    }


    callback(null, output);
  })
}

function extract_song(row) {
  var song_title = row.find('.views-field-title').text().trim();
  var lyrics = row.find('.lyrics-content').text().split("&nbsp;").join("\n\n").trim();

  return {song_title: song_title, song_lyrics: lyrics};
}

lookup(function(err, result) {
  fs.writeFile("bowie_official.json", JSON.stringify(result, null, 2), function(err) {
    if (err) {
      console.error("Error!");
    } else {
      console.log("OK!");
    }
  });
})