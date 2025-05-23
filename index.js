// Initialize data and filters
let visibleData = Array.from(data);
let sortFilter = { prop: 'yachtski', desc: true };
let scoreFilter = { lower: 0, upper: 100 };
let textFilter = '';

document.addEventListener('DOMContentLoaded', function () {
  createListFromData(visibleData);

  const scoreFilters = document.getElementsByClassName('score-filter');
  for (let filter of scoreFilters) {
    filter.addEventListener('click', (e) => {
      for (let f of scoreFilters) {
        f.classList.remove('active');
      }

      filter.classList.add('active');
      onFilterByScore(e.target.attributes.lower.value, e.target.attributes.upper.value);
    })
  }

  const sortFilters = document.getElementsByClassName('sort-filter');
  for (let filter of sortFilters) {
    filter.addEventListener('click', (e) => {
      onSort(e.target.attributes.prop.value)
    })
  }

  search = document.getElementById('list-search');
  search.addEventListener('keyup', (e) => {
    onFilterByText(e.target.value);
  });
}, false);


function createListFromData() {
  visibleData = Array.from(data);

  // Filter and sort data
  // Uses callbacks so filter functions are executed in order.
  filterByScore()
    .then(() => {
      filterByText();
    })
    .then(() => {
      sortBy();
    })
    .then(() => {
      // Generate song list
      const songList = document.getElementById('songList');
      songList.innerHTML = '';

      visibleData.forEach((song) => {
        row = createRow(song);

        songList.appendChild(row);
      })
    })
}

function onSort(prop) {
  const isPropActive = (prop == sortFilter.prop);

  if (isPropActive) {
    sortFilter.desc = !sortFilter.desc;
  }
  else {
    desc = !['artist', 'title', 'episode'].includes(prop);
    sortFilter = { prop: prop, desc: desc };
  }

  createListFromData();
}

function sortBy(desc = false, parse = x => x) {
  return new Promise(function(resolve, reject) {
    const sortOrder = sortFilter.desc ? -1 : 1;
    visibleData = visibleData.sort((a, b) => {
      // sort comparison function
      let result = 0;
      if (parse(a[sortFilter.prop]) < parse(b[sortFilter.prop])) {
          result = -1;
      }
      if (parse(a[sortFilter.prop]) > parse(b[sortFilter.prop])) {
          result = 1;
      }
      return result * sortOrder;
    });

    resolve();
  });
}

function onFilterByText(value) {
  textFilter = value;

  createListFromData();
}

function filterByText() {
  return new Promise(function(resolve, reject) {
    let reg = new RegExp(textFilter, 'i');
    visibleData = visibleData.filter((song) => {
      return song.title.toString().match(reg) || song.artist.toString().match(reg);
    });
    resolve();
  });
}

function onFilterByScore(lower, upper) {
  scoreFilter.lower = parseInt(lower);
  scoreFilter.upper = parseInt(upper);

  createListFromData()
}

function filterByScore() {
  return new Promise(function(resolve, reject) {
    visibleData = visibleData.filter((song) => {
      const isLessThanUpper = scoreFilter.upper == 100 ? (song.yachtski <= scoreFilter.upper) : song.yachtski < scoreFilter.upper
      return song.yachtski >= scoreFilter.lower && isLessThanUpper;
    });

    resolve();
  });
}

function createRow(song) {
  // Create empty row
  const row = document.createElement('div');
  row.className = 'song-row';
  row.style.backgroundColor = getColorForScore(song.yachtski);
  row.style.border = '2px solid '+ getColorForScore(song.yachtski);

  // Add yachtski column
  const yachskiColumn = document.createElement('div');
  yachskiColumn.className = 'white-text';
  yachskiColumn.textContent = song.yachtski;
  row.appendChild(yachskiColumn);

  // Add title column
  const titleColumn = document.createElement('div');
  titleColumn.className = 'left-align';

  if (song.yt_id) {
    const link = document.createElement('a');

    var a = document.createElement('a');
    var linkText = document.createTextNode(song.artist + ' - ' + song.title);
    a.appendChild(linkText);
    a.title = song.artist + ' - ' + song.title;
    a.href = `https://www.youtube.com/watch?v=${song.yt_id}`;
    a.target = '_blank';

    titleColumn.appendChild(a);
  }
  else {
    titleColumn.textContent = song.artist + ' - ' + song.title;
  }

  row.appendChild(titleColumn);

  // Add year column
  const yearColumn = document.createElement('div');
  yearColumn.textContent = song.year;
  row.appendChild(yearColumn);

  // Add jd column
  const jdColumn = document.createElement('div');
  jdColumn.className = 'white-text hidden-sm';
  jdColumn.style.backgroundColor = getColorForScore(song.jd_score);
  jdColumn.textContent = song.jd_score;
  row.appendChild(jdColumn);

  // Add hunter column
  const hunterColumn = document.createElement('div');
  hunterColumn.className = 'white-text hidden-sm';
  hunterColumn.style.backgroundColor = getColorForScore(song.hunter_score);
  hunterColumn.textContent = song.hunter_score;
  row.appendChild(hunterColumn);

  // Add steve column
  const steveColumn = document.createElement('div');
  steveColumn.className = 'white-text hidden-sm';
  steveColumn.style.backgroundColor = getColorForScore(song.steve_score);
  steveColumn.textContent = song.steve_score;
  row.appendChild(steveColumn);

  // Add dave column
  const daveColumn = document.createElement('div');
  daveColumn.className = 'white-text hidden-sm';
  daveColumn.style.backgroundColor = getColorForScore(song.dave_score);
  daveColumn.textContent = song.dave_score;
  row.appendChild(daveColumn);

  // Add episode column
  const episodeColumn = document.createElement('div');
  episodeColumn.className = 'hidden-md';
  episodeColumn.textContent = song.episode;
  row.appendChild(episodeColumn);

  return row;
}
