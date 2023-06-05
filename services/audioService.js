const fs = require("fs");
const mic = require("mic");
const { Readable } = require("stream");
const readlineSync = require("readline-sync");

async function recordAudio(filename) {
  return new Promise((resolve, reject) => {
    const micInstance = mic({
      rate: "16000",
      channels: "1",
      fileType: "wav",
    });

    const micInputStream = micInstance.getAudioStream();
    const output = fs.createWriteStream(filename);
    const writable = new Readable().wrap(micInputStream);

    readlineSync.question("\nPresione la tecla 'enter' para comenzar a grabar.");

    console.log("\n[Grabando...] Pulsa Ctrl+C para parar.");

    writable.pipe(output);

    micInstance.start();

    process.on("SIGINT", () => {
      micInstance.stop();
      console.log("\n[Grabación finalizada]");
      resolve();
    });

    micInputStream.on("error", (err) => {
      console.log("[Error en la recepción de audio, por favor reinicie la app.]")
      reject(err);
    });
  });
}

async function transcribe(filename, openai) {
  const file = fs.createReadStream(filename);

  const response = await openai.createTranscription(
    file, // The audio file to transcribe.
    "whisper-1", // The model to use for transcription.
    undefined, // The prompt to use for transcription.
    "json", // The format of the transcription.
    1, // Temperature
    "es" // Language
  );
  return response.data.text;
}

module.exports = {
  recordAudio,
  transcribe,
};