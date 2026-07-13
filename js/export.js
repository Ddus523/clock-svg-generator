function exportDial(){
  var cfg = readCFG();
  download("dial.svg", buildDialStandaloneSVG(cfg));
}
function exportIndices(){
  var cfg = readCFG();
  download("indices.svg", buildIndicesStandaloneSVG(cfg));
}
function exportHand(which){
  var cfg = readCFG();
  download("hand_" + which + ".svg", buildHandStandaloneSVG(cfg, which));
}
function exportAll(){
  var cfg = readCFG();
  exportDial();
  setTimeout(function(){ exportIndices(); }, 150);
  setTimeout(function(){ exportHand("hour"); }, 300);
  setTimeout(function(){ exportHand("minute"); }, 450);
  if(cfg.hands.second.enabled){
    setTimeout(function(){ exportHand("second"); }, 600);
  }
}
