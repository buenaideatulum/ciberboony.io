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
                    "Authorization": "Bearer sk-svcacct-MZsF_NJu5qCcH4sqAogE1VYvNhnUIx77ptbJ6luqOn3Jml0IDod9Xnt-TtNHzWT3BlbkFJ4MbzpXoi1ueaJ6iw4tM-GPWLQzrE48QjG7Vgk5so8OvwqGm6Gg-8H7dIdvUDEA"
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
