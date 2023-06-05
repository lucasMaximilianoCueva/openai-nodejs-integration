# NODEJS + OPENAI + WHISPER

Aplicación de Node.js que integra la API de OpenAI para crear un chatbot que pueda entender y responder a las consultas del usuario en lenguaje natural, y utiliza Whisper para transcribir voz a texto, permitiendo al modelo de lenguaje responder.

## Iniciar el proyect
```http
npm install
```
Puede iniciar el proyecto en 3 modos diferentes: "voice", "text" y "file". Por defecto, se utiliza "text".
```http
npm run voice
npm run text
npm run file
node index.js
```

## Primer paso: Loguearse a OpenAI

Para obtener tu clave de API de OpenAI, debes crear una cuenta de usuario en [https://openai.com/](https://openai.com/) y acceder a la sección "Claves de API" en el panel de control de OpenAI para crear una nueva clave de API.
Documentación de referencia: [https://platform.openai.com/docs/api-reference/authentication](https://platform.openai.com/docs/api-reference/authentication)

## Dependencias

```json
"dependencies": {
  "@ffmpeg-installer/ffmpeg": "^1.1.0",
  "dotenv": "^16.1.3",
  "fluent-ffmpeg": "^2.1.2",
  "mic": "^2.1.2",
  "openai": "^3.2.1",
  "readline-sync": "^1.4.10"
}

El paquete dotenv se utiliza para gestionar variables de entorno en un archivo .env en el proyecto.

Funcionalidad

Este código de Node.js define un chatbot interactivo que utiliza la API ChatGPT de OpenAI (modelo gpt-3.5-turbo) para generar respuestas a las entradas del usuario.

Modelo elegido “gpt-3.5-turbo”, antes con “text-davinci-003” no era posible proveer un contexto a nuestro prompt, no era posible seguir la conversación  que estaba pasando, menor costo y mayor eficiencia. Gracias a este modelo podemos proveer de contexto para las preguntas consecuentes que hagamos

La aplicación permite seleccionar diferentes modos de entrada:

"voice": graba la voz del usuario, transcribe el audio a texto y envía el texto como prompt al modelo de lenguaje.
"text": permite al usuario escribir un mensaje como entrada para el chatbot.
"file": transcribe automáticamente un archivo de audio estático ubicado en la ruta especificada en la variable de entorno "STATIC_AUDIO", y envía el texto transcribo como prompt al modelo de lenguaje.
Después de recibir la primera respuesta del chatbot, se le pregunta al usuario: "¿Le gustaría continuar la conversación? (Y/N)". Si el usuario responde "Y", se repite el paso anterior. Si el usuario responde "N", se finaliza la ejecución del programa. Cualquier otra respuesta se considera inválida y se muestra un mensaje de error.

Audio Service

API Whisper de OpenAI

@ffmpeg-installer/ffmpeg: Este paquete proporciona un binario FFmpeg, que es un popular framework multimedia para manejar varios formatos de audio y vídeo. Se utiliza junto con fluent-ffmpeg para trabajar con archivos de audio.
fluent-ffmpeg: Este paquete es una API fluida para trabajar con FFmpeg, el framework multimedia. Proporciona una interfaz cómoda y fácil de usar para realizar tareas de procesamiento de audio y vídeo, como convertir formatos, extraer metadatos, etc.
mic: Este paquete es un módulo sencillo y ligero para grabar audio utilizando un micrófono en una aplicación Node.js. Proporciona una interfaz sencilla para acceder al micrófono del sistema y capturar la entrada de audio. Se utiliza para grabar la voz del usuario en este proyecto.
La función recordAudio se encarga de la grabación de audio utilizando el paquete mic. El audio se guarda en el nombre de archivo especificado. La función devuelve una nueva Promise que se resolverá o rechazará en función del éxito o fracaso del proceso de grabación.

La función transcribeAudio toma el nombre de archivo del audio grabado y lo transcribe utilizando la API Whisper Speech-to-Text de OpenAI.