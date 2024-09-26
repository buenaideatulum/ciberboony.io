const API_KEY = "sk-gQcVS604xvhVlwGqoFuRiOxwciM20JvJp0ySv6NFOwT3BlbkFJSv04-BBv_yZ-XqqDjt0zLbjwEtqkibjb6aCtB5mlwA";

async function getCompletion(prompt) {
  try {
    const response = await fetch(`https://api.openai.com/v1/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 20,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener la respuesta de la API:", error);
    throw error; // Lanza el error para manejarlo donde se llame a esta función
  }
}

// getCompletion()

const prompt = document.querySelector("#prompt");
const button = document.querySelector("#generate");
const output = document.querySelector("#output");

button.addEventListener("click", async () => {
  if (!prompt.value.trim()) {
    window.alert("Please enter a prompt");
    return; // Detener ejecución si no hay valor
  }

  try {
    const response = await getCompletion(prompt.value);
    console.log("Respuesta de la API:", response);
    output.innerHTML = response.choices[0].text;
  } catch (error) {
    output.innerHTML = "Error al generar respuesta. Revisa la consola para más detalles.";
  }
});
