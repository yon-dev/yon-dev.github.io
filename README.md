# yon-dev.github.io
Hello and welcome to the new code base for Yacht or Nyacht! As you may have noticed, we've stripped the whole thing down to the bones. There are a few reasons for that:

<ul>
  <li>
    <strong>Costs:</strong> The previous implementation of the site hosted a public API for a massive database (largely due to the 1000s of generated personnel pages), and received enough traffic     over the front-end to push it out of the free plans available on Heroku.
  </li>

  <li>
    <strong>Maintenance:</strong> The previous implementation was two separate apps- a backend REST API built on Rails 5 and PostgreSQL, and a frontend application built with Vue.js and Nuxt.js. That's a lot of code to maintain, and it's not very accessible to new contributors. 
  </li>
  
  <li>
    <strong>Difficult to update:</strong> One of the core functionalities of Yacht or Nyacht <italic>should have been</italic> adding new songs as they are rated. Unfortunately, the previous implementation made this extremely difficult, largely for reasons of data inconsistency/integrity and a complicated and uncooperative Discogs integration. There was an entire "episode builder" feature under contruction, but never completed, so the process for adding songs apparently involved manipulating the database directly, which is too complicated for a normal person to do.
  </li>
</ul>

This implementation resolves these issues! Costs are low (free) because we've removed the massive database in favor of structured data served directly from a local `data.js` file, and we can host it (for the time being) on Github Pages. Maintenance is trivial because we're starting over with a tiny code base that uses only HTML/CSS/Vanilla JS- no frameworks, no APIs, no backend. Updating the site to add new songs is also trivial- simply update the `data.js` file, and anyone can do it.

In the future, we may want to build back some of the functionality from the previous implementation of the site. If you have feature ideas, or if you'd like to contribute, get in touch right here on Github!

## How to add a song

The list of songs on the site is stored in [data.js](https://github.com/yon-dev/yon-dev.github.io/blob/main/data.js). It's a Javascript file that sets a variable `data` to an array of objects that represent songs. These objects are structured like this:

```
  {
    "title": [STRING] // The title of the song, e.g. "This Is It",
    "artist": [STRING] // The name of the artist(s), e.g. "Kenny Loggins",
    "year": [INTEGER] // The year of the song's original release, e.g. 1979,
    "episode": [STRING] // The episode during which the song was rated, eg "YON006",
    "jd_score": [FLOAT] // The score JD gave the song, e.g. 97.0,
    "hunter_score": [FLOAT] // The score Hunter gave the song, e.g. 99.0,
    "steve_score": [FLOAT] // The score Steve gave the song, e.g. 99.0,
    "dave_score": [FLOAT] // The score Dave gave the song, e.g. 98.0,
    "yachtski": [FLOAT] // The score Gene Yachtski gave the song, e.g. 98.25,
    "yt_id": [STRING] // The `id` attribute from the song's Youtube URL, eg "VS52sEUqxMo"
  }
```

So, the simplest way to add a new song would be to manually add individual new song objects to the array in `data.js` (this can be done directly on github, and any updates that are pushed to the `main` branch will automatically update the site). When you have a lot of songs to add, that's kind of a hassle. It'd be better to pull the data directly from the Yachtski spreadsheet, but in the mean time, 

I made a script that can generate the `data.js` file by parsing an exported CSV of the spreadsheet. I'll put it in a gist or something. It's not the best, because the spreadsheet has some issues with bad and missing data, which have to be corrected every time you re-run the script. 

I can improve this eventually if it proves to be necessary. Maybe, once the list is up to date, it won't be such a pain to "manually" add a few songs at a time, since it's like filling in a spreadsheet.
