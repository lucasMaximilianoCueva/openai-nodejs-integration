const readlineSync = require("readline-sync");
const { recordAudio, transcribe } = require("../services/audioService");
const { saveMessage, getMessages } = require("../repository/repository");

async function startConversation(transcription, openai, entryMethod) {
  const storedMessages = await getMessages(); // obtengo el historial de mensajes para dar contexto
  const history = [];
  for (let i = 0; i < storedMessages.length; i++) {
    history.push([storedMessages[0].input_text, storedMessages[0].completion_text])
  }

  let user_input_again = "";
  const audioFilename = process.env.AUDIO_FILE_NAME;

  while (true) {
    let user_input;

    if (entryMethod == "voice") {
      if (user_input_again.toUpperCase() === "Y") {
        await recordAudio(audioFilename).then(async () => {
          transcription = await transcribe(audioFilename, openai);
        });
      }
      if (transcription == "") {
        readlineSync.question(
          "\nLo siento, pero no puedo entender lo que está intentando decir. ¿Podría reformular su pregunta o declaración en un lenguaje más claro? (Presione 'enter' para volver a grabar): "
        );
        await recordAudio(audioFilename).then(async () => {
          transcription = await transcribe(audioFilename, openai);
        });
      }

      user_input = transcription;
      
    } else if (entryMethod == "text") {
      user_input = readlineSync.question("\n¿En qué puedo ayudarte hoy?: ");
    } else if (entryMethod == "file") {
      user_input = transcription;
    }

    const messages = [];
    for (const [input_text, completion_text] of history) {
      messages.push({ role: "system", content: "Eres un ayudante muy útil." }); // comportamiento de la IA
      messages.push({ role: "user", content: input_text });
      messages.push({ role: "assistant", content: completion_text });
    }

    if (user_input != "") {
      messages.push({ role: "user", content: user_input });
    }

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      const completion_text = completion.data.choices[0].message.content;

      console.log("\nAsistente: " + completion_text);

      history.push([user_input, completion_text]);
      await saveMessage({ input_text: user_input, completion_text }); // guardo el ultimo mensaje generado

      user_input_again = readlineSync.question(
        "\n¿Le gustaría continuar la conversación? (Y/N): "
      );
      if (user_input_again.toUpperCase() === "N") {
        return;
      } else if (user_input_again.toUpperCase() !== "Y") {
        console.log(
          "Entrada no válida. Por favor, introduzca 'Y' o 'N'. (vuelva a iniciar el asistente)"
        );
        return;
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.error(error.message);
      }
    }
  }
}

module.exports = {
  startConversation,
};
