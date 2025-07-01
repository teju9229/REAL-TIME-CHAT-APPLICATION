let isLogin = false;
let currentUser = "";

function toggleAuth() {
  isLogin = !isLogin;
  document.getElementById("auth-title").textContent = isLogin ? "Login" : "Signup";
  document.getElementById("switch-label").textContent = isLogin ? "Signup" : "Login";
}

function handleAuth() {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value.trim();

  if (!username || !password) return alert("Fill all fields");

  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (isLogin) {
    if (!users[username] || users[username] !== password) {
      return alert("Invalid credentials");
    }
  } else {
    if (users[username]) return alert("User already exists");
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful, now login");
    toggleAuth();
    return;
  }

  currentUser = username;
  localStorage.setItem("currentUser", currentUser);
  startChat();
}

function startChat() {
  document.getElementById("auth-box").style.display = "none";
  document.getElementById("chat-container").style.display = "flex";
  document.getElementById("welcome-text").textContent = `Welcome, ${currentUser}`;
  loadMessages();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

function loadMessages() {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";
  const messages = JSON.parse(localStorage.getItem("messages") || "[]");

  messages.forEach(msg => {
    appendMessage(msg.user + ": " + msg.text, msg.user === currentUser);
  });
}

function appendMessage(msg, self = false) {
  const div = document.createElement("div");
  div.classList.add("message");
  if (self) div.classList.add("self");
  div.innerText = msg;
  document.getElementById("chat-box").appendChild(div);
  document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
}

document.getElementById("chat-form").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (text === "") return;

  const messages = JSON.parse(localStorage.getItem("messages") || "[]");
  const newMsg = { user: currentUser, text };
  messages.push(newMsg);
  localStorage.setItem("messages", JSON.stringify(messages));

  appendMessage(`${currentUser}: ${text}`, true);
  input.value = "";
});

// Auto-login if session exists
window.onload = () => {
  const user = localStorage.getItem("currentUser");
  if (user) {
    currentUser = user;
    startChat();
  }
};
