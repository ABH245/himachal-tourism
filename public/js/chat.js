const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

chatToggle.addEventListener('click', () => chatWindow.classList.toggle('hidden'));
chatClose.addEventListener('click', () => chatWindow.classList.add('hidden'));

function appendMsg(text, type) {
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  appendMsg(msg, 'user');
  chatInput.value = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    appendMsg(data.reply, 'bot');
  } catch {
    appendMsg('Sorry, something went wrong. Try again!', 'bot');
  }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
