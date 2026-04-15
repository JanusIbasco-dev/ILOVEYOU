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
const loveWhisperContainer = document.getElementById("loveWhisperContainer");
const missMeBtn = document.getElementById("missMeBtn");
const closeLoveMomentBtn = document.getElementById("closeLoveMomentBtn");
const loveMomentOverlay = document.getElementById("loveMomentOverlay");
const faviconEl = document.getElementById("dynamicFavicon");

const loveDate = new Date("2021-08-02T00:00:00");
const romanticMessage = `My love Romaliza,

Every day with you feels like a soft sunrise after a long night.
You make my world calmer, brighter, and warmer in ways words can barely hold.

Thank you for your laughter, your kindness, and the way you love me so purely.
With you, even the smallest moments become precious memories.

I love your smile, your heart, your dreams, and everything that makes you... you.
No matter where life takes us, my heart will always find its way back to yours.

Forever yours. 💖`;

let typingStarted = false;
let isMusicPlaying = false;
let sectionObserver = null;
let motionProfile = null;
let overlayHeartTimer = null;

const whisperLines = [
  "I love you 💖",
  "You are my favorite person 🥺",
  "You are my home 🤍",
  "Forever us ✨"
];

function getMotionProfile() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallMobile = window.matchMedia("(max-width: 480px)").matches;
  const isTablet = window.matchMedia("(max-width: 768px)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (prefersReducedMotion) {
    return {
      heartInterval: 2000,
      sparkleInterval: 2200,
      heartDurationMin: 8000,
      heartDurationRange: 2500,
      heartSizeMin: 10,
      heartSizeRange: 10,
      sparkleDurationMin: 1400,
      sparkleDurationRange: 900,
      cursorSparkles: false,
      cursorThrottle: 180
    };
  }

  if (isSmallMobile) {
    return {
      heartInterval: 950,
      sparkleInterval: 880,
      heartDurationMin: 9800,
      heartDurationRange: 4400,
      heartSizeMin: 10,
      heartSizeRange: 15,
      sparkleDurationMin: 1700,
      sparkleDurationRange: 1600,
      cursorSparkles: false,
      cursorThrottle: 110
    };
  }

  if (isTablet) {
    return {
      heartInterval: 700,
      sparkleInterval: 620,
      heartDurationMin: 8500,
      heartDurationRange: 4200,
      heartSizeMin: 11,
      heartSizeRange: 18,
      sparkleDurationMin: 1900,
      sparkleDurationRange: 1700,
      cursorSparkles: !isCoarsePointer,
      cursorThrottle: 85
    };
  }

  return {
    heartInterval: 520,
    sparkleInterval: 360,
    heartDurationMin: 7000,
    heartDurationRange: 5000,
    heartSizeMin: 12,
    heartSizeRange: 24,
    sparkleDurationMin: 2500,
    sparkleDurationRange: 2400,
    cursorSparkles: true,
    cursorThrottle: 65
  };
}

function updateLoveCounter() {
  const now = new Date();
  const diff = now - loveDate;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  daysCount.textContent = days.toLocaleString();
}

function typeWriter(text, element, speed = 30) {
  element.textContent = "";
  element.classList.add("typing");

  let i = 0;

  function writeNextChar() {
    if (i >= text.length) {
      element.classList.remove("typing");
      return;
    }

    const char = text.charAt(i);
    element.textContent += char;
    i += 1;

    let delay = speed;
    if (char === "." || char === "!" || char === "?") {
      delay = 280;
    } else if (char === "," || char === ";" || char === ":") {
      delay = 130;
    } else if (char === "\n") {
      delay = 260;
    }

    setTimeout(writeNextChar, delay);
  }

  writeNextChar();
}

function revealLoveMessage() {
  loveMessageSection.classList.remove("hidden");
  loveMessageSection.classList.add("in-view");

  if (sectionObserver) {
    sectionObserver.observe(loveMessageSection);
  }

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
    surpriseBtn.textContent = "Open this 💌";
  } else {
    surpriseBtn.textContent = "You opened it 😍";
  }
}

function syncMusicButtonUI() {
  musicToggle.classList.toggle("playing", isMusicPlaying);
  musicToggle.textContent = isMusicPlaying ? "🎶" : "🎵";
  musicToggle.title = isMusicPlaying ? "Pause music" : "Play music";
  musicToggle.setAttribute("aria-label", musicToggle.title);
}

async function toggleMusic() {
  try {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      syncMusicButtonUI();
      return;
    }

    bgMusic.muted = false;
    await bgMusic.play();
    isMusicPlaying = true;
    syncMusicButtonUI();
  } catch (error) {
    isMusicPlaying = false;
    syncMusicButtonUI();
  }
}

function spawnHeart() {
  const profile = motionProfile || getMotionProfile();
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.35 ? "💖" : "💗";

  const left = 2 + Math.random() * 96;
  const duration = profile.heartDurationMin + Math.random() * profile.heartDurationRange;
  const size = profile.heartSizeMin + Math.random() * profile.heartSizeRange;

  heart.style.left = `${left}vw`;
  heart.style.bottom = "-40px";
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}ms`;

  heartContainer.appendChild(heart);

  setTimeout(() => heart.remove(), duration);
}

function spawnSparkle() {
  const profile = motionProfile || getMotionProfile();
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";

  const left = 3 + Math.random() * 94;
  const top = Math.random() * 100;
  const duration = profile.sparkleDurationMin + Math.random() * profile.sparkleDurationRange;

  sparkle.style.left = `${left}vw`;
  sparkle.style.top = `${top}vh`;
  sparkle.style.animationDuration = `${duration}ms`;

  sparkleContainer.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), duration);
}

function initParticles() {
  motionProfile = getMotionProfile();
  setInterval(spawnHeart, motionProfile.heartInterval);
  setInterval(spawnSparkle, motionProfile.sparkleInterval);
}

function spawnLoveWhisper() {
  const whisper = document.createElement("span");
  whisper.className = "love-whisper";
  whisper.textContent = whisperLines[Math.floor(Math.random() * whisperLines.length)];

  const left = 6 + Math.random() * 84;
  const duration = 6800 + Math.random() * 4400;
  const size = 14 + Math.random() * 14;

  whisper.style.left = `${left}vw`;
  whisper.style.bottom = `${6 + Math.random() * 14}vh`;
  whisper.style.fontSize = `${size}px`;
  whisper.style.animationDuration = `${duration}ms`;

  loveWhisperContainer.appendChild(whisper);
  setTimeout(() => whisper.remove(), duration);
}

function initLoveWhispers() {
  const interval = motionProfile && motionProfile.heartInterval > 900 ? 12000 : 8400;
  setInterval(spawnLoveWhisper, interval);
}

function spawnClickHeartBurst(x, y) {
  const hearts = ["💖", "💗", "💕", "✨"];
  for (let i = 0; i < 6; i += 1) {
    const heart = document.createElement("span");
    heart.className = "click-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const offsetX = (Math.random() - 0.5) * 70;
    const offsetY = (Math.random() - 0.5) * 35;
    heart.style.left = `${x + offsetX}px`;
    heart.style.top = `${y + offsetY}px`;
    heart.style.fontSize = `${12 + Math.random() * 14}px`;
    heart.style.animationDelay = `${Math.random() * 100}ms`;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
}

function initHeartBurstClicks() {
  document.addEventListener("pointerdown", (event) => {
    // Ignore right click and multi-touch secondary pointers.
    if (event.button && event.button !== 0) {
      return;
    }

    spawnClickHeartBurst(event.clientX, event.clientY);
  });
}

function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.addEventListener("pointermove", (event) => {
    const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
    const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;
    const x = (xRatio * 7).toFixed(2);
    const y = (yRatio * 7).toFixed(2);
    document.body.style.setProperty("--parallax-x", `${x}px`);
    document.body.style.setProperty("--parallax-y", `${y}px`);
  });
}

function spawnMomentHeart() {
  if (loveMomentOverlay.classList.contains("hidden")) {
    return;
  }

  const heart = document.createElement("span");
  heart.className = "moment-heart";
  heart.textContent = Math.random() > 0.2 ? "💗" : "✨";
  heart.style.left = `${4 + Math.random() * 92}vw`;
  heart.style.bottom = "-30px";
  const duration = 6500 + Math.random() * 3500;
  heart.style.animationDuration = `${duration}ms`;
  heart.style.fontSize = `${16 + Math.random() * 24}px`;
  loveMomentOverlay.appendChild(heart);
  setTimeout(() => heart.remove(), duration);
}

function openLoveMoment() {
  loveMomentOverlay.classList.remove("hidden");
  overlayHeartTimer = setInterval(spawnMomentHeart, 420);
}

function closeLoveMoment() {
  loveMomentOverlay.classList.add("hidden");
  if (overlayHeartTimer) {
    clearInterval(overlayHeartTimer);
    overlayHeartTimer = null;
  }
}

function createEmojiFavicon(emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text y="50" x="50%" text-anchor="middle" font-size="50">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function initAnimatedFavicon() {
  const icons = [createEmojiFavicon("💗"), createEmojiFavicon("✨")];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % icons.length;
    faviconEl.href = icons[index];
  }, 1000);
}

function initScrollReveal() {
  const sections = document.querySelectorAll(".section");
  sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  sections.forEach((section) => {
    if (!section.classList.contains("hidden")) {
      sectionObserver.observe(section);
    }
  });
}

function spawnCursorSparkle(x, y) {
  const sparkle = document.createElement("span");
  sparkle.className = "cursor-sparkle";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.animationDuration = `${450 + Math.random() * 500}ms`;
  sparkleContainer.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 900);
}

function initCursorSparkles() {
  if (!motionProfile.cursorSparkles) {
    return;
  }

  let lastTime = 0;
  document.addEventListener("pointermove", (event) => {
    const now = Date.now();
    if (now - lastTime < motionProfile.cursorThrottle) {
      return;
    }

    lastTime = now;
    spawnCursorSparkle(event.clientX, event.clientY);
  });
}

function initEvents() {
  revealBtn.addEventListener("click", revealLoveMessage);
  surpriseBtn.addEventListener("click", toggleSurprise);
  musicToggle.addEventListener("click", toggleMusic);
  missMeBtn.addEventListener("click", openLoveMoment);
  closeLoveMomentBtn.addEventListener("click", closeLoveMoment);
  loveMomentOverlay.addEventListener("click", (event) => {
    if (event.target === loveMomentOverlay) {
      closeLoveMoment();
    }
  });
}

function init() {
  bgMusic.muted = true;
  updateLoveCounter();
  syncMusicButtonUI();
  initEvents();
  initScrollReveal();
  initParticles();
  initLoveWhispers();
  initCursorSparkles();
  initHeartBurstClicks();
  initParallax();
  initAnimatedFavicon();
}

init();

