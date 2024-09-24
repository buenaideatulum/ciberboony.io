// Memoria de Boony
let memory = {};

// Función para guardar conocimiento nuevo
function addKnowledge(question, answer) {
    memory[question.toLowerCase()] = answer;
}

// Función para obtener respuesta
function getResponse(userInput) {
    const inputLower = userInput.toLowerCase();

    // Si hay una respuesta en la memoria, la devuelve
    if (memory[inputLower]) {
        return memory[inputLower];
    } else {
        // Respuesta predeterminada si no se encuentra conocimiento
        return "Lo siento, no tengo información sobre eso. Puedes enseñarme algo nuevo.";
    }
}

// Función para procesar la pregunta y respuesta
function processQuestion(userInput) {
    const response = getResponse(userInput);
    if (response.startsWith("Lo siento")) {
        // Si no se tiene respuesta, pedir conocimiento nuevo
        const newKnowledge = prompt("¿Qué debería saber sobre esto?");
        if (newKnowledge) {
            addKnowledge(userInput, newKnowledge);
            return `Gracias por enseñarme. Ahora sé: ${newKnowledge}`;
        }
    }
    return response;
}
