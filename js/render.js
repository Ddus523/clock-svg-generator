var CFG = null;
var liveInterval = null;

// Holds uploaded custom images (data URLs) - kept outside the DOM-driven CFG
// since <input type="file"> does not persist its read content across renders.
var customAssets = {
  hourIndex: null,
  minuteTick: null,
  handHour: null,
  handMinute: null,
  handSecond: null
};

function readCFG(){
  return {
    dial: {
      shape: document.querySelector('input[name="dialShape"]:checked').value,
      diameterMM: parseFloat($("diameter").value) || 200,
      cornerRadius: parseFloat($("cornerRadius").value) || 0,
      strokeWidth: parseFloat($("dialStroke").value) || 2,
      bgColor: $("dialBg").value,
      strokeColor: $("dialColor").value,
      minuteTicks: $("minuteTicks").checked,
      tickLength: parseFloat($("tickLen").value) || 3,
      tickWidth: parseFloat($("tickWidth").value) || 0.6,
      customTicks: $("customTicks").checked,
      customTickImage: customAssets.minuteTick,
      customTickSize: parseFloat($("customTickSize").value) || 3,
      customTickRotation: parseFloat($("tickIconRotation").value) || 0,
      centerText: $("centerText").value,
      centerTextSize: parseFloat($("centerTextSize").value) || 8,
      centerTextY: parseFloat($("centerTextY").value) || 30
    },
    indices: {
      style: $("indexStyle").value,
      count: parseInt($("indexCount").value) || 12,
      size: parseFloat($("indexSize").value) || 10,
      distance: parseFloat($("indexDistance").value) || 85,
      color: $("indexColor").value,
      traditionalFour: $("traditionalFour").checked,
      emphasizeCardinal: $("emphasizeCardinal").checked,
      customImage: customAssets.hourIndex,
      customRotation: parseFloat($("indexIconRotation").value) || 0
    },
    hands: {
      hour: {
        shape: $("hourShape").value,
        length: parseFloat($("hourLength").value) || 50,
        width: parseFloat($("hourWidth").value) || 6,
        tail: parseFloat($("hourTail").value) || 15,
        color: $("hourColor").value,
        customImage: customAssets.handHour,
        iconRotation: parseFloat($("hourIconRotation").value) || 0
      },
      minute: {
        shape: $("minuteShape").value,
        length: parseFloat($("minuteLength").value) || 72,
        width: parseFloat($("minuteWidth").value) || 4,
        tail: parseFloat($("minuteTail").value) || 15,
        color: $("minuteColor").value,
        customImage: customAssets.handMinute,
        iconRotation: parseFloat($("minuteIconRotation").value) || 0
      },
      second: {
        enabled: $("secondEnabled").checked,
        shape: $("secondShape").value,
        length: parseFloat($("secondLength").value) || 82,
        width: parseFloat($("secondWidth").value) || 1.5,
        tail: parseFloat($("secondTail").value) || 25,
        color: $("secondColor").value,
        customImage: customAssets.handSecond,
        iconRotation: parseFloat($("secondIconRotation").value) || 0
      }
    },
    mode: document.querySelector('input[name="mode"]:checked').value,
    staticTime: {
      h: parseInt($("staticH").value) || 0,
      m: parseInt($("staticM").value) || 0,
      s: parseInt($("staticS").value) || 0
    }
  };
}

function currentAngles(cfg){
  var h, m, s;
  if(cfg.mode === "live"){
    var now = new Date();
    h = now.getHours() % 12;
    m = now.getMinutes();
    s = now.getSeconds() + now.getMilliseconds()/1000;
  } else {
    h = cfg.staticTime.h % 12;
    m = cfg.staticTime.m;
    s = cfg.staticTime.s;
  }
  return {
    hour: (h + m/60) * 30,
    minute: (m + s/60) * 6,
    second: s * 6
  };
}

function renderAll(){
  CFG = readCFG();
  var R = CFG.dial.diameterMM / 2;
  var cx = R, cy = R;

  var svg = $("clockSvg");
  svg.setAttribute("viewBox", "0 0 " + CFG.dial.diameterMM + " " + CFG.dial.diameterMM);

  var dialMarkup = buildDialMarkup(CFG, cx, cy, R);
  var indicesMarkup = buildIndicesMarkup(CFG, cx, cy, R);

  var angles = currentAngles(CFG);
  var handsMarkup = "";
  handsMarkup += buildHandPreviewMarkup(CFG.hands.hour, cx, cy, R, angles.hour);
  handsMarkup += buildHandPreviewMarkup(CFG.hands.minute, cx, cy, R, angles.minute);
  if(CFG.hands.second.enabled){
    handsMarkup += buildHandPreviewMarkup(CFG.hands.second, cx, cy, R, angles.second);
  }
  handsMarkup += '<circle cx="' + cx + '" cy="' + cy + '" r="' + round(R*0.02 + 1.2) + '" fill="' + CFG.hands.hour.color + '"/>';

  svg.innerHTML = dialMarkup + indicesMarkup + handsMarkup;

  var dict = i18n[currentLang];
  $("info-bar-text").textContent = round(CFG.dial.diameterMM,1) + "mm \u00d8 \u00b7 " +
    (CFG.mode === "live" ? dict["mode-live"] : dict["mode-static"]);

  toggleStaticTimeVisibility();
  toggleConditionalFields(CFG);
}

function toggleStaticTimeVisibility(){
  var isLive = document.querySelector('input[name="mode"]:checked').value === "live";
  $("staticTimeField").style.display = isLive ? "none" : "block";
}

// Shows/hides fields whose relevance depends on other selected options.
function toggleConditionalFields(cfg){
  $("cornerRadiusField").style.display = cfg.dial.shape === "square" ? "block" : "none";
  $("diameterLabel").textContent = i18n[currentLang][cfg.dial.shape === "square" ? "field-side" : "field-diameter"];

  $("customTickUploadField").style.display = cfg.dial.customTicks ? "block" : "none";
  $("tickWidth").closest(".field").style.display = cfg.dial.customTicks ? "none" : "block";

  $("customIndexUploadField").style.display = cfg.indices.style === "custom" ? "block" : "none";
  $("indexColor").closest(".field").style.display = cfg.indices.style === "custom" ? "none" : "block";

  ["hour","minute","second"].forEach(function(which){
    var isCustom = cfg.hands[which].shape === "custom";
    $(which + "CustomUploadField").style.display = isCustom ? "block" : "none";
    $(which + "Tail").closest(".field").style.display = isCustom ? "none" : "block";
  });
}

function startLiveClock(){
  stopLiveClock();
  liveInterval = setInterval(function(){
    if(CFG && CFG.mode === "live") renderAll();
  }, 1000);
}
function stopLiveClock(){
  if(liveInterval){ clearInterval(liveInterval); liveInterval = null; }
}

function onModeChange(){
  var mode = document.querySelector('input[name="mode"]:checked').value;
  document.querySelectorAll(".mode-toggle button[data-mode]").forEach(function(b){
    b.classList.toggle("active", b.dataset.mode === mode);
  });
  if(mode === "live") startLiveClock(); else stopLiveClock();
  renderAll();
}
