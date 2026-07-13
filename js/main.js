window.addEventListener("load", function(){
  applyI18n();

  // language switch
  document.querySelectorAll(".lang-pill button").forEach(function(b){
    b.addEventListener("click", function(){ setLang(b.dataset.lang); });
  });

  // mode toggle buttons (static/live)
  document.querySelectorAll(".mode-toggle button").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelector('input[name="mode"][value="' + b.dataset.mode + '"]').checked = true;
      onModeChange();
    });
  });

  // wire every input/select/checkbox/color to re-render on change/input
  var allInputs = document.querySelectorAll(".controls input, .controls select");
  allInputs.forEach(function(el){
    var evt = (el.type === "checkbox" || el.tagName === "SELECT") ? "change" : "input";
    el.addEventListener(evt, function(){ renderAll(); });
  });

  // export buttons
  $("btnDlDial").addEventListener("click", exportDial);
  $("btnDlIndices").addEventListener("click", exportIndices);
  $("btnDlHour").addEventListener("click", function(){ exportHand("hour"); });
  $("btnDlMinute").addEventListener("click", function(){ exportHand("minute"); });
  $("btnDlSecond").addEventListener("click", function(){ exportHand("second"); });
  $("btnDlAll").addEventListener("click", exportAll);

  // set a nice default static time (10:10:30 - classic watch pose)
  $("staticH").value = 10;
  $("staticM").value = 10;
  $("staticS").value = 30;

  toggleStaticTimeVisibility();
  renderAll();
});
