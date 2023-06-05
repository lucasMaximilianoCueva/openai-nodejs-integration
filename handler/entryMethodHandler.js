const handleEntryMethod = async (container, entryMethod, audioFilename, staticAudio) => {

  switch (entryMethod) {
    case "voice":
      await container.recordAudio(audioFilename).then(async () => {
        let transcription = await container.transcribe(
          audioFilename,
          container.openai
        );
        await container.startConversation(
          transcription,
          container.openai,
          entryMethod
        );
      });
      break;
    case "text":
      await container.startConversation(
        "default",
        container.openai,
        entryMethod
      );
      break;
    case "file":
      let transcription = await container.transcribe(
        staticAudio,
        container.openai
      );
      await container.startConversation(
        transcription,
        container.openai,
        entryMethod
      );
      break;
    default:
      console.log("Método de entrada no válido.");
      break;
  }
};

module.exports = {
  handleEntryMethod,
};
