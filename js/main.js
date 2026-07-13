// Reads an uploaded file (SVG/PNG/JPG) as a data URL and stores it in customAssets, then re-renders.
function wireFileInput(inputId, assetKey, statusId){
  var input = $(inputId);
  if(!input) return;
  input.addEventListener("change", function(){
    var file = input.files && input.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(e){
      customAssets[assetKey] = e.target.result;
      if(statusId && $(statusId)) $(statusId).textContent = file.name;
      renderAll();
    };
    reader.readAsDataURL(file);
  });
}

window.addEventListener("load", function(){
  applyI18n();

  // language switch
  document.querySelectorAll(".lang-pill button").forEach(function(b){
    b.addEventListener("click", function(){ setLang(b.dataset.lang); });
  });

  // mode toggle buttons (static/live)
  document.querySelectorAll(".mode-toggle button[data-mode]").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelector('input[name="mode"][value="' + b.dataset.mode + '"]').checked = true;
      onModeChange();
    });
  });

  // dial shape toggle (circle/square)
  document.querySelectorAll(".mode-toggle button[data-shape]").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelector('input[name="dialShape"][value="' + b.dataset.shape + '"]').checked = true;
      document.querySelectorAll(".mode-toggle button[data-shape]").forEach(function(x){
        x.classList.toggle("active", x === b);
      });
      renderAll();
    });
  });

  // wire every input/select/checkbox/color to re-render on change/input
  var allInputs = document.querySelectorAll(".controls input:not([type=file]), .controls select");
  allInputs.forEach(function(el){
    var evt = (el.type === "checkbox" || el.type === "radio" || el.tagName === "SELECT") ? "change" : "input";
    el.addEventListener(evt, function(){ renderAll(); });
  });

  // custom file uploads
  wireFileInput("hourIndexFile", "hourIndex", "hourIndexFileName");
  wireFileInput("minuteTickFile", "minuteTick", "minuteTickFileName");
  wireFileInput("hourHandFile", "handHour", "hourHandFileName");
  wireFileInput("minuteHandFile", "handMinute", "minuteHandFileName");
  wireFileInput("secondHandFile", "handSecond", "secondHandFileName");

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
