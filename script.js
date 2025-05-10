// Fonction d'envoi du message
async function sendMessage() {
  const input = document.getElementById("message-input");
  const message = input.value.trim();

  if (message === "") return;  // Ne rien envoyer si le champ est vide

  displayMessage("user", message);  // Afficher le message de l'utilisateur
  input.value = "";  // Vider le champ de saisie

  // Ajouter la réponse du bot
  displayMessage("bot", "Typing...");

  const response = await fetch('./api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: message })
  });

  const data = await response.json();
  const botReply = data.reply || "Sorry, I didn't understand that.";

  // Remplacer "Typing..." par la vraie réponse du bot
  const messages = document.getElementById("chat-box");
  const lastMessage = messages.lastElementChild;
  if (lastMessage && lastMessage.classList.contains("bot")) {
    lastMessage.querySelector(".message-text").textContent = botReply;
  } else {
    displayMessage("bot", botReply);
  }
}

// Fonction d'affichage d'un message dans le chat
function displayMessage(sender, content) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  const textElement = document.createElement("div");
  textElement.classList.add("message-text");
  textElement.textContent = content;

  messageElement.appendChild(textElement);
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;  // Scroller vers le bas
}