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
const faviconEl = document.getElementById("dynamicFavicon");
const dailySurprise = document.getElementById("dailySurprise");
const letterButtons = document.querySelectorAll(".letter-btn");
const lettersModal = document.getElementById("lettersModal");
const lettersModalText = document.getElementById("lettersModalText");
const lettersCloseBtn = document.getElementById("lettersCloseBtn");
const universeStars = document.getElementById("universeStars");
const universeMessage = document.getElementById("universeMessage");
const heartScore = document.getElementById("heartScore");
const heartGoal = document.getElementById("heartGoal");
const heartGameArea = document.getElementById("heartGameArea");
const heartGameMessage = document.getElementById("heartGameMessage");
const modeButtons = document.querySelectorAll(".mode-btn");

const loveDate = new Date("2021-08-02T00:00:00");
const romanticMessage = `My love Romaliza,

Every day with you feels like a soft sunrise after a long night.
You make my world calmer, brighter, and warmer in ways words can barely hold.

Thank you for your laughter, your kindness, and the way you love me so purely.
With you, even the smallest moments become precious memories.

I love your smile, your heart, your dreams, and everything that makes you... you.
No matter where life takes us, my heart will always find its way back to yours.

Forever yours. 💖`;

const letterMessages = {
  sad: `Hey love,

If today feels heavy, come here for a second and breathe with me.
You are never alone in your pain, and I will always stay by your side.

You are strong, precious, and deeply loved. 🤍`,
  miss: `Hi baby,

If you miss me, close your eyes and imagine my arms around you.
Every heartbeat of mine says your name with so much love.

Distance can never make me love you less. 💖`,
  sleep: `My love,

When night feels long, let this be your soft little lullaby.
You are safe, you are cherished, and tomorrow is another day for us.

Sleep peacefully, my favorite person. 🌙`
};

const universeMemories = [
  "Remember our first long conversation? I still replay it with a smile.",
  "You made an ordinary day feel magical just by being there.",
  "Your laugh is my favorite sound in this universe.",
  "Loving you is the easiest thing my heart has ever done.",
  "Every memory with you feels like a tiny star I keep forever.",
  "You turned my world into a softer, brighter place."
];

const dailyMessages = [
  "You are my favorite person 💖",
  "I'm always thinking about you 🥺",
  "You make my world brighter ✨"
];

const whisperLines = [
  "I love you 💖",
  "You are my favorite person 🥺",
  "You are my home 🤍",
  "Forever us ✨"
];

let typingStarted = false;
let isMusicPlaying = false;
let sectionObserver = null;
let motionProfile = null;
let particleTimer = null;
let sparkleTimer = null;
let currentParticleMode = "hearts";
let collectorScore = 0;
let collectorSpawnTimer = null;

function getMotionProfile() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallMobile = window.matchMedia("(max-width: 480px)").matches;
  const isTablet = window.matchMedia("(max-width: 768px)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (prefersReducedMotion) {
    return {
      particleInterval: 1900,
      sparkleInterval: 2200,
      particleDurationMin: 7800,
      particleDurationRange: 2200,
      particleSizeMin: 10,
      particleSizeRange: 10,
      sparkleDurationMin: 1400,
      sparkleDurationRange: 900,
      cursorSparkles: false,
      cursorThrottle: 180
    };
  }

  if (isSmallMobile) {
    return {
      particleInterval: 960,
      sparkleInterval: 900,
      particleDurationMin: 9400,
      particleDurationRange: 3600,
      particleSizeMin: 10,
      particleSizeRange: 14,
      sparkleDurationMin: 1700,
      sparkleDurationRange: 1400,
      cursorSparkles: false,
      cursorThrottle: 120
    };
  }

  if (isTablet) {
    return {
      particleInterval: 700,
      sparkleInterval: 640,
      particleDurationMin: 8400,
      particleDurationRange: 3400,
      particleSizeMin: 11,
      particleSizeRange: 17,
      sparkleDurationMin: 1800,
      sparkleDurationRange: 1500,
      cursorSparkles: !isCoarsePointer,
      cursorThrottle: 90
    };
  }

  return {
    particleInterval: 520,
    sparkleInterval: 380,
    particleDurationMin: 7000,
    particleDurationRange: 5000,
    particleSizeMin: 12,
    particleSizeRange: 24,
    sparkleDurationMin: 2500,
    sparkleDurationRange: 2400,
    cursorSparkles: true,
    cursorThrottle: 65
  };
}

function safeAddListener(element, eventName, handler) {
  if (element) {
    element.addEventListener(eventName, handler);
  }
}

function updateLoveCounter() {
  if (!daysCount) {
    return;
  }

  const now = new Date();
  const diff = now - loveDate;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  daysCount.textContent = days.toLocaleString();
}

function typeWriter(text, element, speed = 30, onComplete = null) {
  if (!element) {
    return;
  }

  element.textContent = "";
  element.classList.add("typing");

  let i = 0;
  function writeNextChar() {
    if (i >= text.length) {
      element.classList.remove("typing");
      if (typeof onComplete === "function") {
        onComplete();
      }
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
  if (!loveMessageSection) {
    return;
  }

  loveMessageSection.classList.remove("hidden");
  loveMessageSection.classList.add("in-view");

  if (sectionObserver) {
    sectionObserver.observe(loveMessageSection);
  }

  if (!typingStarted) {
    typingStarted = true;
    typeWriter(romanticMessage, typedMessage, 26);
  }

  loveMessageSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleSurprise() {
  if (!surpriseMessage || !surpriseBtn) {
    return;
  }

  surpriseMessage.classList.toggle("hidden");
  surpriseBtn.textContent = surpriseMessage.classList.contains("hidden") ? "Open this 💌" : "You opened it 😍";
}

function syncMusicButtonUI() {
  if (!musicToggle) {
    return;
  }

  musicToggle.classList.toggle("playing", isMusicPlaying);
  musicToggle.textContent = isMusicPlaying ? "🎶" : "🎵";
  musicToggle.title = isMusicPlaying ? "Pause music" : "Play music";
  musicToggle.setAttribute("aria-label", musicToggle.title);
}

async function toggleMusic() {
  if (!bgMusic) {
    return;
  }

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

function getParticleDisplay() {
  if (currentParticleMode === "petals") {
    return { glyph: "🌸", className: "particle-petal" };
  }

  if (currentParticleMode === "sparkles") {
    return { glyph: "✨", className: "particle-sparkle" };
  }

  return { glyph: Math.random() > 0.35 ? "💖" : "💗", className: "particle-heart" };
}

function spawnFloatingParticle() {
  if (!heartContainer) {
    return;
  }

  const profile = motionProfile || getMotionProfile();
  const particle = document.createElement("span");
  const display = getParticleDisplay();
  particle.className = `heart ${display.className}`;
  particle.textContent = display.glyph;

  const left = 2 + Math.random() * 96;
  const duration = profile.particleDurationMin + Math.random() * profile.particleDurationRange;
  const size = profile.particleSizeMin + Math.random() * profile.particleSizeRange;

  particle.style.left = `${left}vw`;
  particle.style.bottom = "-40px";
  particle.style.fontSize = `${size}px`;
  particle.style.animationDuration = `${duration}ms`;

  heartContainer.appendChild(particle);
  setTimeout(() => particle.remove(), duration);
}

function spawnAmbientSparkle() {
  if (!sparkleContainer) {
    return;
  }

  const profile = motionProfile || getMotionProfile();
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = `${3 + Math.random() * 94}vw`;
  sparkle.style.top = `${Math.random() * 100}vh`;

  const duration = profile.sparkleDurationMin + Math.random() * profile.sparkleDurationRange;
  sparkle.style.animationDuration = `${duration}ms`;

  sparkleContainer.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), duration);
}

function startParticleLoop() {
  motionProfile = getMotionProfile();

  if (particleTimer) {
    clearInterval(particleTimer);
  }

  if (sparkleTimer) {
    clearInterval(sparkleTimer);
  }

  particleTimer = setInterval(spawnFloatingParticle, motionProfile.particleInterval);
  sparkleTimer = setInterval(spawnAmbientSparkle, motionProfile.sparkleInterval);
}

function initParticles() {
  startParticleLoop();
}

function spawnLoveWhisper() {
  if (!loveWhisperContainer) {
    return;
  }

  const whisper = document.createElement("span");
  whisper.className = "love-whisper";
  whisper.textContent = whisperLines[Math.floor(Math.random() * whisperLines.length)];
  whisper.style.left = `${6 + Math.random() * 84}vw`;
  whisper.style.bottom = `${6 + Math.random() * 14}vh`;
  whisper.style.fontSize = `${14 + Math.random() * 14}px`;

  const duration = 6800 + Math.random() * 4400;
  whisper.style.animationDuration = `${duration}ms`;

  loveWhisperContainer.appendChild(whisper);
  setTimeout(() => whisper.remove(), duration);
}

function initLoveWhispers() {
  const interval = motionProfile && motionProfile.particleInterval > 900 ? 12000 : 8400;
  setInterval(spawnLoveWhisper, interval);
}

function spawnClickHeartBurst(x, y) {
  const hearts = ["💖", "💗", "💕", "✨"];
  for (let i = 0; i < 6; i += 1) {
    const heart = document.createElement("span");
    heart.className = "click-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x + (Math.random() - 0.5) * 70}px`;
    heart.style.top = `${y + (Math.random() - 0.5) * 35}px`;
    heart.style.fontSize = `${12 + Math.random() * 14}px`;
    heart.style.animationDelay = `${Math.random() * 100}ms`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
}

function initHeartBurstClicks() {
  document.addEventListener("pointerdown", (event) => {
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
    const x = ((event.clientX / window.innerWidth - 0.5) * 14).toFixed(2);
    const y = ((event.clientY / window.innerHeight - 0.5) * 14).toFixed(2);
    document.body.style.setProperty("--parallax-x", `${x}px`);
    document.body.style.setProperty("--parallax-y", `${y}px`);
  });
}

function createEmojiFavicon(emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text y="50" x="50%" text-anchor="middle" font-size="50">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function initAnimatedFavicon() {
  if (!faviconEl) {
    return;
  }

  const icons = [createEmojiFavicon("💗"), createEmojiFavicon("✨")];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % icons.length;
    faviconEl.href = icons[index];
  }, 1000);
}

function initScrollReveal() {
  const sections = document.querySelectorAll(".section");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("in-view"));
    return;
  }

  sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  sections.forEach((section) => {
    if (!section.classList.contains("hidden")) {
      sectionObserver.observe(section);
    }
  });
}

function spawnCursorSparkle(x, y) {
  if (!sparkleContainer) {
    return;
  }

  const sparkle = document.createElement("span");
  sparkle.className = "cursor-sparkle";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.animationDuration = `${450 + Math.random() * 500}ms`;
  sparkleContainer.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 900);
}

function initCursorSparkles() {
  if (!motionProfile || !motionProfile.cursorSparkles) {
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

function showDailySurprise() {
  if (!dailySurprise) {
    return;
  }

  dailySurprise.textContent = dailyMessages[Math.floor(Math.random() * dailyMessages.length)];
  dailySurprise.classList.remove("hidden");
  setTimeout(() => dailySurprise.classList.add("hidden"), 6500);
}

function openLetter(type) {
  const message = letterMessages[type];
  if (!message || !lettersModal || !lettersModalText) {
    return;
  }

  lettersModal.classList.remove("hidden");
  typeWriter(message, lettersModalText, 24);
}

function closeLettersModal() {
  if (lettersModal) {
    lettersModal.classList.add("hidden");
  }
}

function initOpenWhenLetters() {
  letterButtons.forEach((button) => {
    safeAddListener(button, "click", () => openLetter(button.dataset.letter));
  });

  safeAddListener(lettersCloseBtn, "click", closeLettersModal);
  safeAddListener(lettersModal, "click", (event) => {
    if (event.target === lettersModal) {
      closeLettersModal();
    }
  });
}

function initUniverseStars() {
  if (!universeStars || !universeMessage) {
    return;
  }

  universeStars.innerHTML = "";
  for (let i = 0; i < 18; i += 1) {
    const star = document.createElement("button");
    star.className = "star-node";
    star.type = "button";
    star.textContent = "✦";
    star.style.left = `${4 + Math.random() * 90}%`;
    star.style.top = `${6 + Math.random() * 86}%`;
    star.style.fontSize = `${12 + Math.random() * 12}px`;
    star.style.animationDelay = `${Math.random() * 1200}ms`;

    safeAddListener(star, "click", () => {
      const message = universeMemories[Math.floor(Math.random() * universeMemories.length)];
      universeMessage.textContent = message;
      universeMessage.classList.remove("hidden");
    });

    universeStars.appendChild(star);
  }
}

function spawnCollectorHeart() {
  if (!heartGameArea || collectorScore >= Number(heartGoal.textContent || "12")) {
    return;
  }

  if (heartGameArea.childElementCount > 10) {
    return;
  }

  const heart = document.createElement("button");
  heart.type = "button";
  heart.className = "collector-heart";
  heart.textContent = Math.random() > 0.3 ? "💖" : "💗";
  heart.style.left = `${4 + Math.random() * 88}%`;
  heart.style.top = `${6 + Math.random() * 78}%`;
  heart.style.fontSize = `${18 + Math.random() * 16}px`;

  safeAddListener(heart, "click", () => {
    collectorScore += 1;
    if (heartScore) {
      heartScore.textContent = String(collectorScore);
    }
    heart.remove();

    const goal = Number(heartGoal.textContent || "12");
    if (collectorScore >= goal) {
      if (heartGameMessage) {
        heartGameMessage.classList.remove("hidden");
      }
      if (collectorSpawnTimer) {
        clearInterval(collectorSpawnTimer);
      }
    }
  });

  heartGameArea.appendChild(heart);
}

function initHeartCollector() {
  if (!heartGameArea || !heartGoal) {
    return;
  }

  collectorScore = 0;
  if (heartScore) {
    heartScore.textContent = "0";
  }

  heartGameArea.innerHTML = "";
  if (heartGameMessage) {
    heartGameMessage.classList.add("hidden");
  }

  for (let i = 0; i < 6; i += 1) {
    spawnCollectorHeart();
  }

  collectorSpawnTimer = setInterval(spawnCollectorHeart, 1100);
}

function initParticleModeToggle() {
  modeButtons.forEach((button) => {
    safeAddListener(button, "click", () => {
      currentParticleMode = button.dataset.mode || "hearts";
      modeButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function initEvents() {
  safeAddListener(revealBtn, "click", revealLoveMessage);
  safeAddListener(surpriseBtn, "click", toggleSurprise);
  safeAddListener(musicToggle, "click", toggleMusic);

  // Escape key closes overlays softly.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLettersModal();
    }
  });
}

function init() {
  if (bgMusic) {
    bgMusic.muted = true;
  }

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
  initOpenWhenLetters();
  initUniverseStars();
  initHeartCollector();
  initParticleModeToggle();
  showDailySurprise();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

