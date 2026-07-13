// Builds the dial layer markup (background circle + minute ticks + subdials + center text).
// cfg: full CFG object. cx,cy,R are the drawing center and outer radius in mm.
function buildDialMarkup(cfg, cx, cy, R){
  var d = cfg.dial;
  var s = "";

  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + round(R - d.strokeWidth/2) + '" ' +
       'fill="' + d.bgColor + '" stroke="' + d.strokeColor + '" stroke-width="' + d.strokeWidth + '"/>\n';

  if(d.minuteTicks){
    var r1 = R - d.strokeWidth - 1;
    var r2 = r1 - d.tickLength;
    for(var m = 0; m < 60; m++){
      if(cfg.indices.count === 12 && m % 5 === 0) continue; // hour position, skip (index will mark it)
      if(cfg.indices.count === 4 && m % 15 === 0) continue;
      var a = m * 6;
      var p1 = polar(cx, cy, r1, a);
      var p2 = polar(cx, cy, r2, a);
      s += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" ' +
           'stroke="' + d.strokeColor + '" stroke-width="' + d.tickWidth + '" stroke-linecap="round"/>\n';
    }
  }

  if(d.subdials){
    var positions = [];
    if(d.subdialCount === 1) positions = [180];
    else if(d.subdialCount === 2) positions = [90, 270];
    else if(d.subdialCount === 3) positions = [90, 180, 270];
    else positions = [0, 90, 180, 270].slice(0, d.subdialCount);
    var distMM = R * (d.subdialDistance / 100);
    positions.forEach(function(a){
      var c = polar(cx, cy, distMM, a);
      s += '<circle cx="' + c.x + '" cy="' + c.y + '" r="' + d.subdialRadius + '" ' +
           'fill="none" stroke="' + d.strokeColor + '" stroke-width="' + round(d.strokeWidth * 0.6) + '"/>\n';
      s += '<circle cx="' + c.x + '" cy="' + c.y + '" r="' + round(d.subdialRadius * 0.06) + '" ' +
           'fill="' + d.strokeColor + '"/>\n';
    });
  }

  if(d.centerText && d.centerText.trim() !== ""){
    var ty = cy + R * (d.centerTextY / 100);
    s += '<text x="' + cx + '" y="' + round(ty) + '" text-anchor="middle" ' +
         'font-family="Sora, sans-serif" font-size="' + d.centerTextSize + '" ' +
         'fill="' + d.strokeColor + '" font-weight="600" letter-spacing="0.05em">' +
         escapeXml(d.centerText) + '</text>\n';
  }

  return s;
}

function escapeXml(str){
  return String(str).replace(/[<>&'"]/g, function(c){
    return { "<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&apos;", '"':"&quot;" }[c];
  });
}

function buildDialStandaloneSVG(cfg){
  var R = cfg.dial.diameterMM / 2;
  var cx = R, cy = R;
  var inner = buildDialMarkup(cfg, cx, cy, R);
  return svgWrap(cfg.dial.diameterMM, cfg.dial.diameterMM, inner);
}
