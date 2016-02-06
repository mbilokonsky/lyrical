var fs = require('fs');
var analyzer = require("./analyzer");

var artists = [
  "Britney Spears",
  "David Bowie",
  "Leonard Cohen",
  "Nick Cave and the Bad Seeds",
  "Nine Inch Nails",
  "Nirvana",
  "Tom Waits"
];

var all_lyrics = artists.reduce(function(lyrics, artist_name) {
  return lyrics.concat(require(`./lyrics/${artist_name}.json`).map(analyzer.analyze).reduce((output, item) => { return output.concat(item.lyrics)} , []));
}, []);

fs.unlinkSync('corpus.txt');

var outputStream = fs.createWriteStream('corpus.txt', {flags: "a"});
all_lyrics.forEach(line => outputStream.write(line + "\n"));
outputStream.end('');