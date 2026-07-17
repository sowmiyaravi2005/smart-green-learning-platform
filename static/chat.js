const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const modelCaption = document.getElementById("modelCaption");

function clearEmptyState() {
  const emptyState = messages.querySelector(".empty-state");
  if (emptyState) emptyState.remove();
}

function appendMessage(role, content) {
  clearEmptyState();

  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;

  wrapper.appendChild(bubble);
  messages.appendChild(wrapper);
  messages.scrollTop = messages.scrollHeight;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  messageInput.value = "";
  messageInput.disabled = true;

  try {
    const response = await fetch(window.APP_ROUTES?.chat || "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Chat request failed.");
    }

    appendMessage("assistant", data.reply);
    modelCaption.textContent = data.model ? `Model: ${data.model}` : "";
  } catch (error) {
    appendMessage("assistant", error.message);
  } finally {
    messageInput.disabled = false;
    messageInput.focus();
  }
});
