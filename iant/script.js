$(document).ready(function() {

  loadLang("eng")
  $("#french").click(function () {
    // console.log("SaamerD!");
    translate("french");
  });
  $("#eng").click(function () {
    // console.log("SaamerD!");
    translate("eng");
  });

  // Loads quotes as user wishes on clicking the button
  $("#get-live-caption").on("click", buttonTapped);
  //$("#arabic").on("click", function() { translate("arabic"); });
  // Loads the initial quote - without pressing the button
  const unusedVariable = setInterval(recurringFunction, 1000);  
});


var translations =  {
  eng: "",
  // arabic: "",
  french: ""
};

eng = document.getElementById("eng");
//arabic = document.getElementById("arabic");
french = document.getElementById("french");

var isStreamingCaptions = false; 
function buttonTapped() {
  if (isStreamingCaptions){
    stopTimer() 
  } else{ 
    startTimer();
  }
  isStreamingCaptions = !isStreamingCaptions;
}

function showRightTranscript(){
  if (currentLanguage === "eng"){
    transcript = translations.eng
  } else {
    transcript = translations.french
  }
  $("#live-caption").html(transcript);
}

var localization = ""
function loadLang(lang){
  $.getJSON("https://conferencecaptioning.com/iant/"+lang+".json", (text) => {
    localization = text
    console.log("localization")
    console.log(localization)
    console.log("text['caption-header']")
    console.log(text['caption-header'])
    document.getElementById("caption-header").innerHTML = text['caption-header'];
    document.getElementById("get-live-caption").innerHTML = text['get-live-caption'];
    document.getElementById("eng").innerHTML = text['english-language'];
    document.getElementById("french").innerHTML = text['french-language'];
    document.getElementById("live-caption-empty").innerHTML = text['live-caption-empty'];
  });
}

var transcript = "";
var isTesting = false; //TODO: Before publishing, Change this to false
var counter = 0; // Only used for debug
function recurringFunction() {
  if (translations.eng == ""){ //if transcript is empty, show/hide the placeholder
    $('#live-caption-empty').show;
  }
  else {
    $('#live-caption-empty').hide();
    showRightTranscript()
  }
  if (isStreamingCaptions) {
    if (isTesting) {
      transcript = transcript + transcript;
      console.log("transcript is being done" + transcript);
      $("#live-caption").html(transcript+counter++);
    } else {
      getTranscript();
    }
  }
}

function startTimer() {
  $("#get-live-caption").html("Stop Streaming");
  $("#get-live-caption").html(localization['get-live-caption-stop']);
  // eng.className = "active";
  //arabic.className = "disabled";
  // french.className = "disabled";
}

function stopTimer() {
  $("#get-live-caption").html("Get Live Captions");
  $("#get-live-caption").html(localization['get-live-caption']);
  //arabic.className = "";
  // french.className = "";
}

function getTranscript() {
  var url="https://script.google.com/macros/s/AKfycbyjXwiLNAiyQ0myoxcEXW6NkezaI4B9x_PrC2yUhAgUIOC5UX6z0qqitPlY2wlDzCSA/exec?streamName=ExpressAcademy";
  // To avoid using JQuery, you can use this https://stackoverflow.com/questions/3229823/how-can-i-pass-request-headers-with-jquerys-getjson-method
  $.getJSON(
    url,
    function (a) {
      var json = JSON.stringify(a);
      // console.log(json)
      if (a && a.Transcript && a.Transcript != "") {
        // transcript = a.Transcript;
        translations.eng = a.Transcript; //english
        translations.french = a.Transcript_FR;
        // console.log(translations.eng)
        // console.log(translations.french)

        // translations.arabic = a.Transcript_AR;
        // $("#live-caption").html(transcript);
        if (!a.IsActivelyStreaming){
          buttonTapped(); // Automatically stop streaming if event is not live
        }

      }
    }
  );
}

var currentLanguage = "eng" // "french" is the other choice
function translate(language){
  currentLanguage = language
  loadLang(language)
  // console.log("SaamerE!");
  // console.log("H" + language);
  eng.className = "";
  //arabic.className = "";
  french.className = "";
  document.getElementById(language).className = "active";
  $("#live-caption").html(translations[language]);
}