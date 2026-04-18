/* ============ HERO TITLE LETTER BY LETTER ============ */
const titleText = "My Baccha";
const titleEl = document.getElementById("heroTitle");
[...titleText].forEach((ch, i) => {
  const span = document.createElement("span");
  span.className = "char";
  span.textContent = ch;
  span.style.animationDelay = 0.4 + i * 0.12 + "s";
  titleEl.appendChild(span);
});

/* ============ ACTIVE SECTION OBSERVER (for entry animations) ============ */
const mainEl = document.getElementById("main");
const sections = document.querySelectorAll(".snap");
const progressFill = document.getElementById("progressFill");

const activeObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.intersectionRatio > 0.55) {
        e.target.classList.add("active");
      } else {
        e.target.classList.remove("active");
      }
    });
  },
  { threshold: [0, 0.55, 1], root: mainEl },
);

sections.forEach((s) => activeObs.observe(s));

/* ============ SCROLL PROGRESS ============ */
mainEl.addEventListener(
  "scroll",
  () => {
    const max = mainEl.scrollHeight - mainEl.clientHeight;
    const pct = max > 0 ? (mainEl.scrollTop / max) * 100 : 0;
    progressFill.style.width = pct + "%";

    // Subtle parallax on story images
    const vh = mainEl.clientHeight;
    document.querySelectorAll(".story-panel").forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = (center - vh / 2) / vh;
      const img = sec.querySelector(".story-img-wrap");
      if (img && sec.classList.contains("active")) {
        img.style.setProperty("--drift", `${dist * 10}px`);
      }
    });
  },
  { passive: true },
);

/* ============ STORY BUTTON ============ */
const storyBtn = document.getElementById("storyBtn");
const storyWrap = document.getElementById("storyWrap");
const s1 = document.getElementById("s1");

storyBtn.addEventListener("click", () => {
  storyWrap.classList.add("open");
  // register new snap sections with observer
  storyWrap.querySelectorAll(".snap").forEach((s) => activeObs.observe(s));
  requestAnimationFrame(() => {
    s1.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ============ ANYWAYS + TYPEWRITER LETTER ============ */
const anywaysBtn = document.getElementById("anywaysBtn");
const letterSec = document.getElementById("letterSec");
const letterBody = document.getElementById("letterBody");

const letterText = `It's your day — you choose what happens :)
I'll wait for that moment.

But apart from that, from the bottom of my heart —
thank you for being such a beautiful part of my life.
You've helped me grow and be happy, knowingly or unknowingly.
The best thing that happened to me.

I'll give my best to be there whenever needed.
Sorry if I ever did anything that hurt you, or is hurting you.
But our bond is special, and always will be — no matter what.

Enjoy your day. Be happy.
And be happy, always. 💚`;

let typeStarted = false;

anywaysBtn.addEventListener("click", () => {
  requestAnimationFrame(() => {
    letterSec.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  if (typeStarted) return;
  setTimeout(startTyping, 800);
});

function startTyping() {
  if (typeStarted) return;
  typeStarted = true;
  let i = 0;
  letterBody.textContent = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.innerHTML = "&nbsp;";
  letterBody.appendChild(cursor);

  const typeInterval = setInterval(() => {
    if (i >= letterText.length) {
      clearInterval(typeInterval);
      setTimeout(() => cursor.remove(), 1200);
      return;
    }
    cursor.insertAdjacentText("beforebegin", letterText[i]);
    i++;
  }, 26);
}

/* ============ CANDLE BLOW ============ */
const cakeWrap = document.getElementById("cakeWrap");
const candle = document.getElementById("candle");
const wishFinal = document.getElementById("wishFinal");
let blown = false;

cakeWrap.addEventListener("click", () => {
  if (blown) return;
  blown = true;
  candle.classList.add("blown");
  setTimeout(() => {
    wishFinal.classList.add("show");
    burstConfetti();
  }, 500);
});

/* ============ CONFETTI ============ */
const confettiCanvas = document.getElementById("confetti");
const cctx = confettiCanvas.getContext("2d");

function sizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
sizeConfetti();
window.addEventListener("resize", sizeConfetti);

const confettiColors = [
  "#36d07a",
  "#a7f3c6",
  "#1f7a45",
  "#f7f3e4",
  "#ffffff",
  "#7cd6a2",
];
let confettiPieces = [];
let confettiRunning = false;

function burstConfetti() {
  const rect = cakeWrap.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 4;

  for (let i = 0; i < 160; i++) {
    confettiPieces.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -11 - 4,
      g: 0.28,
      size: Math.random() * 8 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach((p) => {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 0.004;

    cctx.save();
    cctx.translate(p.x, p.y);
    cctx.rotate(p.rot);
    cctx.globalAlpha = Math.max(p.life, 0);
    cctx.fillStyle = p.color;
    cctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    cctx.restore();
  });

  confettiPieces = confettiPieces.filter(
    (p) => p.life > 0 && p.y < confettiCanvas.height + 50,
  );

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
  }
}

/* ============ BACKGROUND SPARKLES ============ */
const sparkleCanvas = document.getElementById("sparkles");
const sctx = sparkleCanvas.getContext("2d");

function sizeSparkles() {
  sparkleCanvas.width = window.innerWidth;
  sparkleCanvas.height = window.innerHeight;
}
sizeSparkles();
window.addEventListener("resize", sizeSparkles);

const sparkles = [];
const SPARKLE_COUNT = 45;

for (let i = 0; i < SPARKLE_COUNT; i++) {
  sparkles.push({
    x: Math.random() * sparkleCanvas.width,
    y: Math.random() * sparkleCanvas.height,
    r: Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.6 + 0.2,
    twinkle: Math.random() * Math.PI * 2,
  });
}

function animateSparkles() {
  sctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);

  sparkles.forEach((s) => {
    s.x += s.vx;
    s.y += s.vy;
    s.twinkle += 0.04;

    if (s.x < 0) s.x = sparkleCanvas.width;
    if (s.x > sparkleCanvas.width) s.x = 0;
    if (s.y < 0) s.y = sparkleCanvas.height;
    if (s.y > sparkleCanvas.height) s.y = 0;

    const a = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
    sctx.beginPath();
    sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sctx.fillStyle = `rgba(167, 243, 198, ${a})`;
    sctx.shadowColor = "rgba(54, 208, 122, 0.8)";
    sctx.shadowBlur = 8;
    sctx.fill();
  });

  requestAnimationFrame(animateSparkles);
}
animateSparkles();
