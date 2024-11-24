function getColorForScore(score) {
  var pct = score / 100;
  var percentColors = [
    { pct: 0.0, color: { r: 230, g: 124, b: 115 } },
    { pct: 0.5, color: { r: 255, g: 214, b: 102 } },
    { pct: 1.0, color: { r: 87, g: 187, b: 138 } }
  ];

  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break
    }
  }

  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  var colorRGB = 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  return (pct >= 0) ? colorRGB : 'rgb(150,150,150)';
}

function round(num) {
  return Math.round(num * 100) / 100;
}