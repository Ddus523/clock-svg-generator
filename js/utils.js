function $(id){ return document.getElementById(id); }

function round(v, dec){
  dec = dec === undefined ? 3 : dec;
  var m = Math.pow(10, dec);
  return Math.round(v * m) / m;
}

// angleDeg: 0 = 12 o'clock (up), clockwise positive
function polar(cx, cy, r, angleDeg){
  var rad = (angleDeg - 90) * Math.PI / 180;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) };
}

var ROMAN_MAP = [
  [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],
  [100,"C"],[90,"XC"],[50,"L"],[40,"XL"],
  [10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]
];
function toRoman(num, traditionalFour){
  if(traditionalFour && num === 4) return "IIII";
  if(traditionalFour && num === 9) return "VIIII";
  var result = "", n = num;
  for(var i = 0; i < ROMAN_MAP.length; i++){
    while(n >= ROMAN_MAP[i][0]){
      result += ROMAN_MAP[i][1];
      n -= ROMAN_MAP[i][0];
    }
  }
  return result;
}

function download(filename, content){
  var blob = new Blob([content], {type: "image/svg+xml"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
}

function svgWrap(viewW, viewH, inner){
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + viewW + 'mm" height="' + viewH + 'mm" viewBox="0 0 ' + viewW + ' ' + viewH + '">\n' +
    inner +
    '\n</svg>';
}
