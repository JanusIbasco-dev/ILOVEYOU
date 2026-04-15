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
    surpriseBtn.textContent = "Open this 🥺";
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
}

function init() {
  updateLoveCounter();
  syncMusicButtonUI();
  initEvents();
  initScrollReveal();
  initParticles();
  initCursorSparkles();
}

init();

