// ---- Player ----
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const progress = document.getElementById("progress");
let currentSong = null;

document.querySelectorAll(".song").forEach((song) => {
  song.querySelector(".play").addEventListener("click", () => {
    const src = song.dataset.src;
    audio.src = src;
    document.getElementById("player-cover").src = song.querySelector("img").src;
    document.getElementById("player-title").textContent =
      song.querySelector("h3").textContent;
    document.getElementById("player-artist").textContent =
      song.querySelector("p").textContent;
    audio.play();
    playPauseBtn.textContent = "⏸";
  });
});

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶";
  }
});

// ---- Clima ----
async function fetchWeather() {
  const apiKey = "e69d696cc36dbdf6aad57f1f2d6be4d5"; // OpenWeather
  const city = "São Paulo";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById("weather").textContent =
      `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
  } catch (err) {
    document.getElementById("weather").textContent = "Erro ao carregar clima";
  }
}
fetchWeather();

// ---- Chat ----
const ws = new WebSocket("ws://localhost:3000");
const messages = document.getElementById("messages");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send");

ws.onmessage = (event) => {
  const msg = document.createElement("div");
  msg.textContent = event.data;
  messages.appendChild(msg);
};

sendBtn.addEventListener("click", () => {
  if (input.value.trim() !== "") {
    ws.send(input.value);
    input.value = "";
  }
});