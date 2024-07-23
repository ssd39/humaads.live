import hark from "hark";
import Config from "../config";

const sendRecording = async (audioData) => {
  // first convert the audio data to base64
  var reader = new FileReader();
  reader.readAsDataURL(audioData);
  return new Promise((resolve, reject) => {
    reader.onloadend = async function () {
      const res = await fetch(`${Config.API}/localstt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: reader.result }),
      });
      const res_json = await res.json();
      if(res_json.success){
        resolve(res_json.text)
      }
    };
  });
};

const start_stt_local = async (onResult) => {
  console.log("Starting to record");
  // Get audio stream
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  // Generate the media recorder with stream from media devices
  // Starting position is paused recording
  const mediaRecorder = new MediaRecorder(stream);
  // Also pass the stream to hark to create speaking events
  var speech = hark(stream, {});
  // Start the recording when hark recognizes someone is speakign in the mic
  speech.on("speaking", function () {
    console.log("Speaking!");
    mediaRecorder.start();
  });
  // When hark recognizes the speaking has stopped we can stop recording
  // The stop action will generate ondataavailable() to be triggered
  speech.on("stopped_speaking", function () {
    console.log("Not Speaking");
    if (mediaRecorder.state === "recording") mediaRecorder.stop();
  });
  //
  mediaRecorder.ondataavailable = (e) => {
    sendRecording(e.data).then((newMessage) => {
      onResult(newMessage);
      console.log("whisper_response:", newMessage);
    });
  };

  return () => {
    mediaRecorder.stop();
    speech.stop();
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  };
}

export { start_stt_local };
