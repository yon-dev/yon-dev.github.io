let songs = Array.from(data);
let hosts = ['jd', 'hunter', 'steve', 'dave'];

function statsFor(host) {
  let otherHosts = hosts.filter(hostName => hostName != host);
  
  // Initialize stats object
  var hostStats =  {
    totals: { essential: 0, yacht: 0, nyacht: 0 },
    disagreements: {},
    dissent: { amount: 0, song: {} }
  };

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
  statsFor('jd')
});