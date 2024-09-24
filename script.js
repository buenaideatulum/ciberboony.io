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

// Inicializamos la conversación
let chatHistory = [];

// Función para agregar mensajes al chat
function addMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Desplazarse hacia abajo
}

// Función para manejar el envío de mensajes
document.getElementById('send-btn').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return; // Evitar enviar mensajes vacíos

    addMessage("Tú", userInput);
    chatHistory.push({ user: userInput }); // Guardar entrada del usuario

    // Obtener respuesta de Boony
    const boonyResponse = processQuestion(userInput);
    addMessage("Boony", boonyResponse);
    chatHistory.push({ bot: boonyResponse }); // Guardar respuesta del bot

    // Limpiar el campo de entrada
    document.getElementById('user-input').value = '';
});

// Función para guardar y cargar conversaciones en Local Storage
function saveChat() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChat() {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
        chatHistory = JSON.parse(savedChat);
        chatHistory.forEach(entry => {
            if (entry.user) {
                addMessage("Tú", entry.user);
            }
            if (entry.bot) {
                addMessage("Boony", entry.bot);
            }
        });
    }
}

// Cargar la conversación guardada al iniciar
loadChat();

// Guardar la conversación cada vez que se envía un mensaje
window.addEventListener('beforeunload', saveChat);
