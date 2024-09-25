const sendButton = document.getElementById("sendButton");
const userMessage = document.getElementById("userMessage");
const responseContainer = document.getElementById("responseContainer");

sendButton.addEventListener("click", async () => {
    const message = userMessage.value;
    if (message) {
        responseContainer.innerHTML = "Cargando...";
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: message }]
                })
            });

            const data = await response.json();
            const reply = data.choices[0].message.content;
            responseContainer.innerHTML = reply;
        } catch (error) {
            responseContainer.innerHTML = "Error al obtener respuesta.";
            console.error("Error:", error);
        }
    }
});
