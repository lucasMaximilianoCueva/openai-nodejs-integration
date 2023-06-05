// config.js
const dotenv = require("dotenv");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

function initialize() {
  ffmpeg.setFfmpegPath(ffmpegPath);

  const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
  });

  return new OpenAIApi(configuration);
}

module.exports = {
  initialize,
};