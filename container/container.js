// container.js
const { initialize } = require("../config/config");
const { recordAudio, transcribe } = require("../services/audioService");
const { startConversation } = require("../controller/conversationController");

function createContainer() {
  const openai = initialize();

  return {
    openai,
    recordAudio,
    transcribe,
    startConversation,
  };
}

module.exports = {
  createContainer,
};