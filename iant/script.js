$("document").ready(function () {
  // Loads the initial quote - without pressing the button
  const unusedVariable = setInterval(recurringFunction, 1000);

  // Loads quotes as user wishes on clicking the button
  $("#get-live-caption").on("click", buttonTapped);
  $("#eng").on("click", function() { translate("eng"); });
  //$("#arabic").on("click", function() { translate("arabic"); });
  $("#french").on("click", function() { translate("french"); });
});

var translations =  {
  eng: "",
  arabic: "",
  french: ""
};

eng = document.getElementById("eng");
//arabic = document.getElementById("arabic");
french = document.getElementById("french");

var isStreamingCaptions = false; 
function buttonTapped() {
  isStreamingCaptions ? stopTimer() : startTimer();
  isStreamingCaptions = !isStreamingCaptions;
}

var isTesting = false; //TODO: Before publishing, Change this to false
var transcript = "H ";
var counter = 0;
function recurringFunction() {
  if (isStreamingCaptions) {
    console.log("Work is being done");
    if (isTesting) {
      transcript = transcript + transcript;
      console.log("transcript is being done" + transcript);
      $("#live-caption").html(transcript+counter++);
    } else {
      getQuotes();
    }
  }
}

function startTimer() {
  $("#get-live-caption").html("Stop Streaming");
  eng.className = "active";
  //arabic.className = "disabled";
  french.className = "disabled";
}

function stopTimer() {
  $("#get-live-caption").html("Get Live Captions");
  //arabic.className = "";
  french.className = "";
}

function getQuotes() {
  var url="https://script.google.com/macros/s/AKfycbyn-yIafidHRk8pNQu_uzS4jYwAzDaOEAPdhb6lQx_OcZK7W7iNkNYPZr2S4Li7PjC4/exec?streamName=ConferenceEvent";
  // To avoid using JQuery, you can use this https://stackoverflow.com/questions/3229823/how-can-i-pass-request-headers-with-jquerys-getjson-method
  $.getJSON(
    url,
    function (a) {
      console.log(a);
      console.log(a.value);
      var json = JSON.stringify(a);
      console.log(json);
      if (a && a.Transcript && a.Transcript != "") {
        var transcript = a.Transcript;
        translations.eng = a.Transcript;
        translations.french = a.Transcript_FR;
        translations.arabic = a.Transcript_AR;
        $("#live-caption").html(transcript);
        if (!a.IsActivelyStreaming){
          buttonTapped();
        }

      }
    }
  );
}

function translate(language){
  console.log("H" + language);
  eng.className = "";
  //arabic.className = "";
  french.className = "";
  document.getElementById(language).className = "active";
  $("#live-caption").html(translations[language]);
}