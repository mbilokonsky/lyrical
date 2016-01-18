var jsdom = require("jsdom");
var url_base = "www.allthelyrics.com";

var getURL = function(artist_name) {
  artist_name = artist_name.toLowerCase().split(" ").join("_");
  var url = `http://${url_base}/lyrics/${artist_name}`;
  console.log("Url:", url);
  return url;
}

var getSongURL = function(partial) {
  return `http://${url_base}/${partial}`
}

module.exports = function lookup(artist_name, callback) {
  jsdom.env(getURL(artist_name),
    ["http://code.jquery.com/jquery.js"],
    (err, window) => {
      if (err) {
        return callback(err);
      }

      var song_links = window.$("li.lyrics-list-item a");
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
    var song_title, song_lyrics, album, year;

    song_title = window.$('.page-title').text();
    console.log(song_title, "->");
    if (song_title.charAt(0) === '"') {
      song_title = song_title.substr(1, song_title.length - 9);
      console.log("\t", song_title);
    } else {
      song_title = song_title.substr(0, song_title.length - 7);
      console.log("\t", song_title);
    }


    album = window.$('.content-text-album').text().split("Album: ")[1];

    var content = window.$('.content-text-inner p');
    var paragraphs = [];
    for (var i = 0; i < content.length; i++) {
      paragraphs.push(window.$(content[i]).text());
    }

    song_lyrics = paragraphs.join("\n\n");

    callback(null, {album: album, year: year, title: song_title, lyrics: song_lyrics});
  })
}