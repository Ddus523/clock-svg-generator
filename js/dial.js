// Builds a rounded-rectangle (or plain square) path centered at cx,cy with given half-side and corner radius.
function roundedSquarePath(cx, cy, half, r){
  r = Math.max(0, Math.min(r, half));
  var x0 = round(cx - half), y0 = round(cy - half);
  var x1 = round(cx + half), y1 = round(cy + half);
  if(r <= 0){
    return 'M' + x0 + ',' + y0 + ' L' + x1 + ',' + y0 + ' L' + x1 + ',' + y1 + ' L' + x0 + ',' + y1 + ' Z';
  }
  r = round(r);
  return [
    'M', (x0+r), y0,
    'L', (x1-r), y0,
    'A', r, r, 0, 0, 1, x1, (y0+r),
    'L', x1, (y1-r),
    'A', r, r, 0, 0, 1, (x1-r), y1,
    'L', (x0+r), y1,
    'A', r, r, 0, 0, 1, x0, (y1-r),
    'L', x0, (y0+r),
    'A', r, r, 0, 0, 1, (x0+r), y0,
    'Z'
  ].join(' ');
}

// Builds the dial layer markup (background shape + minute ticks + center text).
// cfg: full CFG object. cx,cy,R are the drawing center and outer "radius" (half-side for square) in mm.
function buildDialMarkup(cfg, cx, cy, R){
  var d = cfg.dial;
  var s = "";

  if(d.shape === "square"){
    var half = R - d.strokeWidth/2;
    s += '<path d="' + roundedSquarePath(cx, cy, half, d.cornerRadius) + '" ' +
         'fill="' + d.bgColor + '" stroke="' + d.strokeColor + '" stroke-width="' + d.strokeWidth + '"/>\n';
  } else {
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + round(R - d.strokeWidth/2) + '" ' +
         'fill="' + d.bgColor + '" stroke="' + d.strokeColor + '" stroke-width="' + d.strokeWidth + '"/>\n';
  }

  if(d.minuteTicks){
    var r1 = R - d.strokeWidth - 1;
    var r2 = r1 - d.tickLength;
    var rMid = (r1 + r2) / 2;
    for(var m = 0; m < 60; m++){
      if(cfg.indices.count === 12 && m % 5 === 0) continue; // hour position, skip (index will mark it)
      if(cfg.indices.count === 4 && m % 15 === 0) continue;
      var a = m * 6;
      if(d.customTicks && d.customTickImage){
        var cpos = polar(cx, cy, rMid, a);
        var cw = d.customTickSize, ch = d.tickLength;
        s += '<g transform="translate(' + cpos.x + ',' + cpos.y + ') rotate(' + a + ')">' +
             '<image href="' + d.customTickImage + '" x="' + round(-cw/2) + '" y="' + round(-ch/2) + '" ' +
             'width="' + round(cw) + '" height="' + round(ch) + '" preserveAspectRatio="xMidYMid meet"/></g>\n';
      } else {
        var p1 = polar(cx, cy, r1, a);
        var p2 = polar(cx, cy, r2, a);
        s += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" ' +
             'stroke="' + d.strokeColor + '" stroke-width="' + d.tickWidth + '" stroke-linecap="round"/>\n';
      }
    }
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
