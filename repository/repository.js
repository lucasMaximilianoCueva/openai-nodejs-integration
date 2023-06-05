const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function saveMessage(message) {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("messages");

    await collection.insertOne(message);

    console.log("[Mensaje guardado exitosamente en MongoDB Atlas]");
  } catch (error) {
    console.error("Error al guardar el mensaje en MongoDB Atlas:", error);
  } finally {
    await client.close();
  }
}

async function getMessages() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("messages");

    const messages = await collection.find().toArray();

    return messages;
  } catch (error) {
    console.error("Error al obtener los mensajes de MongoDB Atlas:", error);
    return [];
  } finally {
    await client.close();
  }
}

module.exports = {
  saveMessage,
  getMessages,
};