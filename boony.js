// boony.js

// Memoria de la IA
const memory = {};

// Función para almacenar conocimiento en la memoria
function remember(key, value) {
  memory[key] = value;
}

// Función para recuperar conocimiento de la memoria
function recall(key) {
  return memory[key] || "Lo siento, no sé la respuesta a esa pregunta.";
}

// Función para procesar la pregunta del usuario
function processQuestion(userInput) {
  // Ejemplo de respuestas predefinidas
  if (userInput.includes("¿Qué es el gelato?")) {
    return "El gelato es un tipo de helado italiano que contiene menos aire y grasa que el helado tradicional.";
  } else if (userInput.includes("¿Cuáles son los pasos de servicio en vitrina?")) {
    return "Los pasos de servicio en vitrina incluyen saludar al cliente, ofrecerles muestras y tomar su pedido.";
  } else {
    // Si no hay respuesta predefinida, intenta recordar la pregunta
    return recall(userInput);
  }
}

// Evento para enviar preguntas a ChatGPT y gestionar respuestas
document.getElementById('send-btn').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;

  // Primero guardamos la pregunta en la base de datos
  db.collection('conversaciones').add({
    pregunta: userInput,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Pregunta guardada exitosamente!");
    
    // Procesamos la pregunta para obtener la respuesta
    const response = processQuestion(userInput);

    // Guardamos la respuesta en memoria
    remember(userInput, response);

    // Muestra la respuesta en el historial de chat
    const chatHistory = document.getElementById('chat-response');
    chatHistory.innerHTML += `<p><strong>Tú:</strong> ${userInput}</p>`;
    chatHistory.innerHTML += `<p><strong>Bonny:</strong> ${response}</p>`;
    
    // Limpiar el campo de entrada
    document.getElementById('user-input').value = '';
  })
  .catch((error) => {
    console.error("Error al guardar la pregunta: ", error);
  });
});
