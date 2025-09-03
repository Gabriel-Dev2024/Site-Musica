// ===== PLAYER =====
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const progress = document.getElementById("progress");

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

// ===== PROGRESS BAR =====
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// ===== CLIMA =====
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

setInterval(fetchWeather, 3000);

// ===== CHAT WS =====
const ws = new WebSocket("ws://localhost:3000");
const messages = document.getElementById("messages");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send");

ws.onmessage = (event) => {
  const msg = document.createElement("div");
  msg.classList.add("message");

  // Opcional: diferenciar mensagens do próprio usuário
  if (event.data.startsWith("Você: ")) {
    msg.classList.add("sent");
    msg.textContent = event.data.replace("Você: ", "");
  } else {
    msg.classList.add("received");
    msg.textContent = event.data;
  }

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
};

sendBtn.addEventListener("click", () => {
  if (input.value.trim() !== "") {
    ws.send(input.value); // envia pro servidor
    input.value = "";
  }
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// ===== TROCA DE ABAS =====
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) =>
      c.classList.remove("active")
    );

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const songsDiv = document.getElementById("songs");

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`;
  const res = await fetch(url);
  const data = await res.json();

  songsDiv.innerHTML = ""; // limpa resultados
  data.results.forEach(song => {
    const div = document.createElement("div");
    div.classList.add("song");
    div.innerHTML = `
      <img src="${song.artworkUrl100}" alt="${song.trackName}" />
      <div>
        <h3>${song.trackName}</h3>
        <p>${song.artistName}</p>
        <audio controls src="${song.previewUrl}"></audio>
      </div>
    `;
    songsDiv.appendChild(div);
  });
});