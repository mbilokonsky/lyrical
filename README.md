# How to Use

  1. `npm install`
  2. `npm run load_artist -- "artist name"`
  3. Lyrics will be in the `lyrics/` folder.

# Notes

This uses various loaders for various lyric lookup sites. `lookup_azlyrics.js` seems to provide better values, but azlyrics will block your domain pretty quickly.

I've found that `lookup_all_the_lyrics.js` works pretty well. There's also a custom david bowie lyric loader. You can swap out which loader you use in `load_artist.js` if you want to experiment, and you can see how they work if you want to write a custom one for some other lyrics site.