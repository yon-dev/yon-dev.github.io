let songs = Array.from(data);
let hosts = ['jd', 'hunter', 'steve', 'dave'];
let currentHost = 'jd';

// Initialize stats object
var hostStats =  {
  totals: { essential: 0, yacht: 0, nyacht: 0 },
  disagreements: {},
  dissent: { amount: 0, song: {} }
};

function statsFor(host) {
  let otherHosts = hosts.filter(hostName => hostName != host);

  // Construct disagreements
  otherHosts.forEach(hostName => hostStats.disagreements[hostName] = { disagreement: 0, song: {}});

  songs.forEach(song => {
    let hostScore = song[host + '_score'];
    
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
    
    // Update disagreements and dissent
    otherHostsScoreTotal = 0;
    otherHosts.forEach(hostName => {
      otherHostScore = song[hostName + '_score'];
      otherHostsScoreTotal += otherHostScore;
      songDisagreement = Math.abs(hostScore - otherHostScore);

      if (songDisagreement > hostStats.disagreements[hostName].disagreement) {
        hostStats.disagreements[hostName] = { disagreement: songDisagreement, song: song }
      }
    });

    dissentAmount = Math.abs(hostScore - (otherHostsScoreTotal / otherHosts.length));

    if (dissentAmount > hostStats.dissent.amount) {
      hostStats.dissent.amount = dissentAmount;
      hostStats.dissent.song = song;
    }
  });
};

// On page load, generate HTML elements
document.addEventListener('DOMContentLoaded', function () {
  statsFor(currentHost);

  const hostNameEls = Array.from(document.getElementsByClassName('host-name'));
  hostNameEls.forEach(el => el.textContent = currentHost); // Now you can use array methods

  generateTotalsElement();

  // Create element for dissent
  const dissentEl = document.getElementById('dissent');

  var dissentStatBar = generateStatBar(hostStats.dissent.song[currentHost + '_score'], hostStats.dissent.amount, hostStats.dissent.song);
  dissentEl.appendChild(dissentStatBar);

  // Create element for disagreements
  const disagreementsEl = document.getElementById('disagreements');

  for (const key in hostStats.disagreements) {
    disagreement = hostStats.disagreements[key];
    
    var disagreementStatBar = generateStatBar(disagreement.song[currentHost + '_score'], disagreement.disagreement, disagreement.song);
    disagreementsEl.appendChild(disagreementStatBar);
  }

  // Create element for totals
  function generateTotalsElement() {
    const totalsEl = document.getElementById('totals');
    
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

  // Creates stat bar element
  function generateStatBar(hostScore, otherScore, song) {
    var statBar = document.createElement('div');
    statBar.className = 'stat-bar-item';
    statBar.style.backgroundColor = getColorForScore(song.yachtski);
  
    var hostScoreEl = document.createElement('div');
    hostScoreEl.className = 'white';
    hostScoreEl.style.backgroundColor = getColorForScore(hostScore);
    hostScoreEl.textContent = hostScore;
  
    var songTitleEl = document.createElement('div');
    songTitleEl.style.backgroundColor = getColorForScore(song.yachtski);
    songTitleEl.textContent = song.artist + ' - ' + song.title;
  
    var otherScoreEl = document.createElement('div');
    otherScoreEl.className = 'white';
    otherScoreEl.style.backgroundColor = getColorForScore(otherScore);
    otherScoreEl.textContent = otherScore;
  
    statBar.appendChild(hostScoreEl);
    statBar.appendChild(songTitleEl);
    statBar.appendChild(otherScoreEl);

    return statBar;
  };
});