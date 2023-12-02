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
