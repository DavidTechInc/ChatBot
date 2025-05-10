// Importation de la bibliothèque nécessaire
const fetch = require('node-fetch');

// Récupération de la clé API à partir des variables d'environnement
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const { message } = JSON.parse(event.body);

    // Vérifier que le message est bien reçu
    if (!message || message.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" })
      };
    }

    try {
      // Appel à l'API OpenAI GPT-4o
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          prompt: message,
          max_tokens: 150
        })
      });

      const data = await response.json();

      // Si l'API retourne une erreur
      if (data.error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: data.error.message })
        };
      }

      // Retourne la réponse de l'API GPT-4o
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: data.choices[0].text.trim()
        })
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" })
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }
};