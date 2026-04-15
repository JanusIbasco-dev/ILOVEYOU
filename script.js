const revealBtn = document.getElementById("revealBtn");
const loveMessageSection = document.getElementById("loveMessage");
const typedMessage = document.getElementById("typedMessage");
const daysCount = document.getElementById("daysCount");
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseMessage = document.getElementById("surpriseMessage");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const heartContainer = document.getElementById("heartContainer");
const sparkleContainer = document.getElementById("sparkleContainer");

const loveDate = new Date("2021-08-02T00:00:00");
const romanticMessage = `My love,

Every day with you feels like a soft sunrise after a long night.
You make my world calmer, brighter, and warmer in ways words can barely hold.

Thank you for your laughter, your kindness, and the way you love me so purely.
With you, even the smallest moments become precious memories.

I love your smile, your heart, your dreams, and everything that makes you... you.
No matter where life takes us, my heart will always find its way back to yours.

Forever yours. 💖`;

let typingStarted = false;
let isMusicPlaying = false;

function updateLoveCounter() {
  const now = new Date();
  const diff = now - loveDate;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  daysCount.textContent = days.toLocaleString();
}

function typeWriter(text, element, speed = 30) {
  element.textContent = "";
  let i = 0;

  const intervalId = setInterval(() => {
    element.textContent += text.charAt(i);
    i += 1;

    if (i >= text.length) {
      clearInterval(intervalId);
    }
  }, speed);
}

function revealLoveMessage() {
  loveMessageSection.classList.remove("hidden");
  if (!typingStarted) {
    typingStarted = true;
    typeWriter(romanticMessage, typedMessage, 26);
  }

  loveMessageSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function toggleSurprise() {
  surpriseMessage.classList.toggle("hidden");
  if (surpriseMessage.classList.contains("hidden")) {
    surpriseBtn.textContent = "Don't click this 😳";
  } else {
    surpriseBtn.textContent = "You clicked it 😍";
  }
}

async function toggleMusic() {
  try {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      musicToggle.textContent = "🎵 Music: Off";
      return;
    }

    await bgMusic.play();
    isMusicPlaying = true;
    musicToggle.textContent = "🎵 Music: On";
  } catch (error) {
    isMusicPlaying = false;
    musicToggle.textContent = "🎵 Tap to Play";
  }
}

function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.35 ? "💖" : "💗";

  const left = Math.random() * 100;
  const duration = 7000 + Math.random() * 5000;
  const size = 12 + Math.random() * 24;

  heart.style.left = `${left}vw`;
  heart.style.bottom = "-40px";
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}ms`;

  heartContainer.appendChild(heart);

  setTimeout(() => heart.remove(), duration);
}

function spawnSparkle() {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";

  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const duration = 2500 + Math.random() * 2400;

  sparkle.style.left = `${left}vw`;
  sparkle.style.top = `${top}vh`;
  sparkle.style.animationDuration = `${duration}ms`;

  sparkleContainer.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), duration);
}

function initParticles() {
  setInterval(spawnHeart, 520);
  setInterval(spawnSparkle, 360);
}

function initEvents() {
  revealBtn.addEventListener("click", revealLoveMessage);
  surpriseBtn.addEventListener("click", toggleSurprise);
  musicToggle.addEventListener("click", toggleMusic);
}

function init() {
  updateLoveCounter();
  initEvents();
  initParticles();
}

init();

