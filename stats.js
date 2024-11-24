const songs = Array.from(data);
const hosts = ['jd', 'hunter', 'steve', 'dave'];
let currentHost = 'jd';

// Initialize stats object
let hostStats =  {
  totals: { essential: 0, yacht: 0, nyacht: 0 },
  dissents: { yacht: [], nyacht: [] },
  disagreements: { yacht: {}, nyacht: {} },
  weirdEssentials: []
};

function initializeStats() {
  hostStats =  {
    totals: { essential: 0, yacht: 0, nyacht: 0 },
    dissents: { yacht: [], nyacht: [] },
    disagreements: { yacht: {}, nyacht: {} },
    weirdEssentials: []
  };
};

function generateStats() {
  // Construct disagreement
  let otherHosts = hosts.filter(hostName => hostName != currentHost);

  otherHosts.forEach(hostName => {
    hostStats.disagreements.yacht[hostName] = { song: {}, difference: 0, otherScore: 0 };
    hostStats.disagreements.nyacht[hostName] = { song: {}, difference: 0, otherScore: 0 };
  });

  songs.forEach(song => {
    let hostScore = song[currentHost + '_score'];
    
    // Update totals
    if (hostScore >= 90) {
      hostStats.totals.essential += 1;
    }
    else if (hostScore >= 50) {
      hostStats.totals.yacht += 1;
    }
    else {
      hostStats.totals.nyacht += 1;
    }
  
    var otherHostsScoreTotal = 0;

    otherHosts.forEach(hostName => {
      var otherHostScore = song[hostName + '_score'];
      otherHostsScoreTotal += otherHostScore;
      var songDisagreement = hostScore - otherHostScore;

      if (songDisagreement > 0 && songDisagreement > hostStats.disagreements.yacht[hostName].difference) {
        hostStats.disagreements.yacht[hostName] = { difference: songDisagreement, otherScore: otherHostScore, song: song };
      }
      else if (songDisagreement < 0 && songDisagreement < hostStats.disagreements.nyacht[hostName].difference) {
        hostStats.disagreements.nyacht[hostName] = { difference: songDisagreement, otherScore: otherHostScore, song: song };
      }
    });

    // Update dissents
    var othersAvg = (otherHostsScoreTotal / otherHosts.length);
    var dissentAmount = hostScore - othersAvg;

    if (dissentAmount > 0) {
      if (hostStats.dissents.yacht.length < 3) {
        hostStats.dissents.yacht.push({ difference: dissentAmount, othersAvg: othersAvg, song: song });
      } else if (dissentAmount > hostStats.dissents.yacht[2].difference) {
        hostStats.dissents.yacht[2] = { difference: dissentAmount, othersAvg: othersAvg, song: song };
      }
    }
    else {
      if (hostStats.dissents.nyacht.length < 3) {
        hostStats.dissents.nyacht.push({ difference: dissentAmount, othersAvg: othersAvg, song: song });
      } else if (dissentAmount < hostStats.dissents.nyacht[2].difference) {
        hostStats.dissents.nyacht[2] = { difference: dissentAmount, othersAvg: othersAvg, song: song };
      }
    }
    
    hostStats.dissents.yacht.sort((a, b) => b.difference - a.difference);
    hostStats.dissents.nyacht.sort((a, b) => a.difference - b.difference);

    // Update weird essentials
    var otherHostAvg = (otherHostsScoreTotal / otherHosts.length);
    if ((hostScore >= 90) && (otherHostAvg < 80)) {
      hostStats.weirdEssentials.push({ otherScore: otherHostAvg, song: song });
    }
  });
};

// On page load, generate HTML elements
document.addEventListener('DOMContentLoaded', function () {
  generateStats();
  generateEls();

  const hostFilters = document.getElementsByClassName('host-filter');
  for (let filter of hostFilters) {
    filter.addEventListener('click', (e) => {
      for (let f of hostFilters) {
        f.classList.remove('active');
      }

      filter.classList.add('active');
      onFilterByHost(e.target.attributes.host.value);
    })
  }

  function onFilterByHost(hostName) {
    const statContent = document.getElementsByClassName('stat-content');
    for (let statEl of statContent) {
      statEl.innerHTML = '';
    };

    currentHost = hostName;

    initializeStats();
    generateStats();
    generateEls();
  };

  function generateEls() {
    generateTotalsElement();
    generateDissentElement();
    generateDisagreementElement();
    generateWeirdEssentialsElement();
  };

  // Create element for totals
  function generateTotalsElement() {
    const totalsEl = document.getElementById('totals').querySelector('.stat-content');

    var essentialTotal = document.createElement('div');
    essentialTotal.style.color = getColorForScore(100);
    essentialTotal.textContent = 'Essential: ' + hostStats.totals.essential;
    totalsEl.appendChild(essentialTotal);

    var yachtTotal = document.createElement('div');
    yachtTotal.style.color = getColorForScore(50);
    yachtTotal.textContent = 'Yacht: ' + hostStats.totals.yacht;
    totalsEl.appendChild(yachtTotal);

    var nyachtTotal = document.createElement('div');
    nyachtTotal.style.color = getColorForScore(0);
    nyachtTotal.textContent = 'Nyacht: ' + hostStats.totals.nyacht;
    totalsEl.appendChild(nyachtTotal);
  };

  function generateDissentElement() {
    const yDissentEl = document.getElementById('yacht-dissent').querySelector('.stat-content');
    const nDissentEl = document.getElementById('nyacht-dissent').querySelector('.stat-content');
    
    yDissentEl.appendChild(generateStatBarHeader('Others'));
    nDissentEl.appendChild(generateStatBarHeader('Others'));
    
    hostStats.dissents.yacht.forEach((dissent) => {
      var dissentStatBar = generateStatBar(dissent.song[currentHost + '_score'], dissent.othersAvg, dissent.song);
      yDissentEl.appendChild(dissentStatBar);
    });

    hostStats.dissents.nyacht.forEach((dissent) => {
      var dissentStatBar = generateStatBar(dissent.song[currentHost + '_score'], dissent.othersAvg, dissent.song);
      nDissentEl.appendChild(dissentStatBar);
    });
  };

  function generateDisagreementElement() {
    const yDisagreementsEl = document.getElementById('yacht-disagreements').querySelector('.stat-content');
    const nDisagreementsEl = document.getElementById('nyacht-disagreements').querySelector('.stat-content');
  
    for (const key in hostStats.disagreements.yacht) {
      disagreement = hostStats.disagreements.yacht[key];
      
      var disagreementStatBarHeader = generateStatBarHeader(key);
      var disagreementStatBar = generateStatBar(disagreement.song[currentHost + '_score'], disagreement.otherScore, disagreement.song);
      
      yDisagreementsEl.appendChild(disagreementStatBarHeader);
      yDisagreementsEl.appendChild(disagreementStatBar);
    }

    for (const key in hostStats.disagreements.nyacht) {
      disagreement = hostStats.disagreements.nyacht[key];
      
      var disagreementStatBarHeader = generateStatBarHeader(key);
      var disagreementStatBar = generateStatBar(disagreement.song[currentHost + '_score'], disagreement.otherScore, disagreement.song);
      
      nDisagreementsEl.appendChild(disagreementStatBarHeader);
      nDisagreementsEl.appendChild(disagreementStatBar);
    }
  };

  function generateWeirdEssentialsElement() {
    const weirdEl = document.getElementById('weird-essentials').querySelector('.stat-content');

    var weirdStatBarHeader = generateStatBarHeader('Others');
    weirdEl.appendChild(weirdStatBarHeader);
    
    hostStats.weirdEssentials.forEach((weirdEssential) => {
      var weirdStatBar = generateStatBar(weirdEssential.song[currentHost + '_score'], weirdEssential.otherScore, weirdEssential.song);
      weirdEl.appendChild(weirdStatBar);
    });
  };

  // Creates stat bar element
  function generateStatBar(hostScore, otherScore, song) {
    var statBar = document.createElement('div');
    statBar.className = 'stat-bar-item';
    statBar.style.backgroundColor = getColorForScore(song.yachtski);
  
    var hostScoreEl = document.createElement('div');
    hostScoreEl.className = 'white';
    hostScoreEl.style.backgroundColor = getColorForScore(hostScore);
    hostScoreEl.textContent = round(hostScore);
  
    var songTitleEl = document.createElement('div');
    songTitleEl.style.backgroundColor = getColorForScore(song.yachtski);
    songTitleEl.textContent = song.artist + ' - ' + song.title;
  
    var otherScoreEl = document.createElement('div');
    otherScoreEl.className = 'white';
    otherScoreEl.style.backgroundColor = getColorForScore(otherScore);
    otherScoreEl.textContent = round(otherScore);
  
    statBar.appendChild(songTitleEl);
    statBar.appendChild(hostScoreEl);
    statBar.appendChild(otherScoreEl);

    return statBar;
  };

  function generateStatBarHeader (otherName) {
    var statBarHeaderEl = document.createElement('div');
    statBarHeaderEl.className = 'stat-bar-header';

    prettyOtherName = prettyNameMap[otherName] || otherName;

    ['\u00A0', prettyNameMap[currentHost], prettyOtherName].forEach((columnName) => {
      var columnNameEl = document.createElement('div');
      columnNameEl.innerText = columnName;

      statBarHeaderEl.appendChild(columnNameEl);
    });

    return statBarHeaderEl;
  };
});