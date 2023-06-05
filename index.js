const { createContainer } = require("./container/container");
const { handleEntryMethod } = require("./handler/entryMethodHandler");

async function main() {
  console.log("\nBienvenido al asistente virtual de OpenAI.");
  const container = createContainer();
  const audioFilename = process.env.AUDIO_FILE_NAME;
  const staticAudio = process.env.STATIC_AUDIO;
  const entryMethod = process.argv[2] || "text";

  await handleEntryMethod(container, entryMethod, audioFilename, staticAudio);
  // creo una instancia del contenedor y llamo a las funciones necesarias según el método de entrada especificado.
}

main().catch((error) => {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  } else {
    console.error(error.message);
  }
});
