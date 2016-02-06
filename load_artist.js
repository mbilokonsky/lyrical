var lookup = require('./lookup_all_the_lyrics.js');
var fs = require('fs');

console.log("RUNNING!");

var artist_name = process.argv[2];
if (!artist_name) {
  console.error("You must provide an artist name.");
  return process.exit();
}

console.info("Retrieving all lyrical data for " + artist_name);

lookup(artist_name, function(err, result) {
  if (err) {
    console.log("Error fetching the remote data!");
    return console.error(err);
  }

  fs.writeFile("lyrics/" + artist_name + ".json", JSON.stringify(result, null, 2), function(err) {
    if (err) {
      console.log("I read the data ok, but had a hard time writing it to a file.")
      return console.error(err);
    }

    console.log("Lyrics retrieved and dumped into local json file!");
  });
});