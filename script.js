// Inicialización de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAZCvRLmK0_oXa1wU_5OELl_n0x7MemqGc",
  authDomain: "ciberconejobonny.firebaseapp.com",
  projectId: "ciberconejobonny",
  storageBucket: "ciberconejobonny.appspot.com",
  messagingSenderId: "559493725302",
  appId: "1:559493725302:web:ab21d3646479cb03743357",
  measurementId: "G-2NTNNCXCCS"
};

// Inicializamos Firebase con la configuración
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variable para controlar si estamos intentando iniciar sesión o registrar
let isRegistering = false;

// Lógica para el inicio de sesión o registro
document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (isRegistering) {
    // Lógica para registrar al usuario
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Usuario registrado con éxito, iniciamos sesión
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('conejo-container').style.display = 'block';
        document.getElementById('chat-container').style.display = 'block';
      })
      .catch((error) => {
        document.getElementById('login-error').textContent = `Error al registrarse: ${error.message}`;
      });
  } else {
    // Lógica para iniciar sesión
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Oculta el formulario de inicio de sesión
        document.getElementById('login-container').style.display = 'none';

        // Muestra el conejo y el cuadro de texto para interactuar
        document.getElementById('conejo-container').style.display = 'block';
        document.getElementById('chat-container').style.display = 'block';
      })
      .catch((error) => {
        // Si el error es "INVALID_LOGIN_CREDENTIALS" o "auth/user-not-found", se ofrece registrarse
        if (error.code === 'auth/user-not-found' || error.message.includes("INVALID_LOGIN_CREDENTIALS")) {
          document.getElementById('login-error').textContent = "Usuario no encontrado o credenciales inválidas. Presiona el botón nuevamente para registrarte.";
          isRegistering = true; // Cambiamos a modo de registro
          document.getElementById('login-btn').textContent = "Registrarse"; // Cambia el texto del botón a 'Registrarse'
        } else {
          // Otros errores
          document.getElementById('login-error').textContent = error.message;
        }
      });
  }
});

// Lógica para enviar preguntas a ChatGPT
document.getElementById('send-btn').addEventListener('click', async () => {
  const userInput = document.getElementById('user-input').value;

  if (!userInput) return; // No enviar si el campo está vacío

  // Muestra que el mensaje está siendo procesado
  document.getElementById('chat-response').textContent = 'Ciber Conejo Bonny está pensando...';

  // Prepara el mensaje para ChatGPT
  const mensaje = {
    model: "gpt-3.5-turbo", // o "gpt-4" si tienes acceso a GPT-4
    messages: [
      { role: "system", content: "Actúa como el Ciber Conejo Bonny, aquí te enviaré toda la conversación previa y la última pregunta." },
      { role: "user", content: userInput }
    ]
  };

  try {
    // Petición a la API de OpenAI
    const response = await axios.post('https://api.openai.com/v1/chat/completions', mensaje, {
      headers: {
        'Authorization': `Bearer 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`, // Tu API Key
        'Content-Type': 'application/json'
      }
    });

    // Obtener la respuesta de ChatGPT
    const gptResponse = response.data.choices[0].message.content;

    // Mostrar la respuesta en la página
    document.getElementById('chat-response').textContent = `Ciber Conejo Bonny: ${gptResponse}`;

    // Guarda la conversación en Firestore
    await db.collection('conversaciones').add({
      pregunta: userInput,
      respuesta: gptResponse,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("Conversación guardada exitosamente!");
  } catch (error) {
    console.error('Error al conectar con ChatGPT:', error);
    document.getElementById('chat-response').textContent = 'Error al conectar con Ciber Conejo Bonny. Inténtalo de nuevo.';
  }

  // Limpiar el campo de entrada
  document.getElementById('user-input').value = '';
});
