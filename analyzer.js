var rhymes = require('rhymes');

module.exports = {
  analyze: function(song) {
    return {
      artist: song.artist,
      year: song.year,
      album: song.album,
      title: song.title,
      // rhyme_schema: getSchema(song.lyrics),
      lyrics: song.lyrics.split('\n')
        .filter(removeEmptyLines)
        .filter(removeNonLyrics)
        .filter(removeSingleWordLines)
        .map(trimLyrics)
    }
  }
}

function getSchema(lyrics) {
  var ends = {};
  var nextSymbol = 65;

  var parts = lyrics.split("\n").map(function(line) {
    if (line === "\n" || line.length === 0) {
      return " ";
    }
    line = line.trim();

    var words = line.split(" ");
    var end_word = words[words.length - 1].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");

    if (ends[end_word]) {
      return ends[end_word];
    }

    var existing_rhyme = rhymes(end_word).reduce(function(match, candidate) {
      if (match) { return match; }
      if (ends[candidate.word]) {
        return ends[candidate.word];
      }

      return null;
    }, null);

    if (existing_rhyme) { return existing_rhyme; }

    ends[end_word] = String.fromCharCode(nextSymbol++);
    return ends[end_word];
  });

  var schema = parts.join("");

  return schema;
}

function removeEmptyLines(line) {
  return !(line === "\n" || line.length === 0)
}

function removeNonLyrics(line) {
  upper = line.toUpperCase();

  return !(upper.indexOf("CHORUS") > -1 ||
    upper.indexOf("VERSE") > -1 ||
    upper.indexOf("[") > -1)
}

function removeSingleWordLines(line) {
  return line.split(" ").length > 2;
}

function trimLyrics(line) {
  return line.trim().replace(/[\/#$%\^&\*;:{}=\-_`~()]/g,"");
}