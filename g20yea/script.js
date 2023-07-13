$("document").ready(function () {
  // Loads the initial quote - without pressing the button
  const unusedVariable = setInterval(recurringFunction, 1000);

  // Loads quotes as user wishes on clicking the button
  $("#get-live-caption").on("click", buttonTapped);
});

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
}

function stopTimer() {
  $("#get-live-caption").html("Get Live Captions");
}

function getQuotes() {
  var url="https://script.google.com/macros/s/AKfycbwktlfrXRqBZEul9W0WTo6N4w9JPv1g6DWxAGfcPqCUZ_YM1EOklglaB2mAfRYAl1M_/exec?streamName=ConferenceEvent"
  // To avoid using JQuery, you can use this https://stackoverflow.com/questions/3229823/how-can-i-pass-request-headers-with-jquerys-getjson-method
  $.getJSON(
    url,
    function (a) {
      console.log(a);
      console.log(a.value);
      var json = JSON.stringify(a);
      console.log(json);
      if (a && a.Transcript && a.Transcript != "") {
        var joke = a.Transcript;
        $("#live-caption").html(joke);
        if (!a.IsActivelyStreaming){
          buttonTapped()
        }

      }
    }
  );
}