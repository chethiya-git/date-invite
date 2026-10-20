// State Management
const state = {
  herName: 'You',
  hisName: 'Me',
  phoneNumber: '',
  selectedDate: '',
  selectedTime: '',
  selectedPlan: 'Dinner',
  dodgeCount: 0,
  soundEnabled: true,
  currentStep: 1
};

// Dodge texts matching the video
const dodgeSubtitles = [
  "Nice try — it dodged you.",
  "Faster than romance.",
  "No is wilting...",
  "Yes is blooming, hm? 🌸",
  "So shy.",
  "Resistance is futile! ✨",
  "Destiny cannot be denied 😉",
  "Still trying? That's adorable.",
  "I won't let you say no!",
  "Just click YES already! 🥰"
];

const dodgeBtnLabels = [
  "Sure?",
  "Wait—",
  "Think again!",
  "Last chance!",
  "nice try 🤍",
  "Really?",
  "Oops!",
  "Nope 🙈",
  "Can't click me!",
  "Give up? 🥺"
];

// Web Audio API Sound Synthesizer
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const soundFX = {
  dodge() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn(e);
    }
  },

  click() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  },

  celebrate() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const now = ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      });
    } catch (e) {}
  },

  letterOpen() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const now = ctx.currentTime + idx * 0.1;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch (e) {}
  }
};

// Canvas Particle Effects (Confetti & Floating Hearts)
const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrameId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y, type = 'confetti') {
    this.x = x;
    this.y = y;
    this.type = type;
    if (type === 'heart') {
      this.emoji = ['💖', '💕', '🌸', '✨', '🤍', '🥰'][Math.floor(Math.random() * 6)];
      this.size = 16 + Math.random() * 16;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = -1.5 - Math.random() * 2.5;
      this.alpha = 1;
      this.decay = 0.006 + Math.random() * 0.008;
    } else {
      const colors = ['#e05a53', '#9fd3b4', '#ffd166', '#f4978e', '#f8ad9d', '#90be6d'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.size = 6 + Math.random() * 6;
      this.vx = (Math.random() - 0.5) * 12;
      this.vy = -6 - Math.random() * 10;
      this.gravity = 0.35;
      this.rotation = Math.random() * 360;
      this.vRot = (Math.random() - 0.5) * 12;
      this.alpha = 1;
      this.decay = 0.012 + Math.random() * 0.012;
    }
  }

  update() {
    if (this.type === 'heart') {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    } else {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.vRot;
      this.alpha -= this.decay;
    }
  }

  draw(context) {
    context.save();
    context.globalAlpha = Math.max(0, this.alpha);
    if (this.type === 'heart') {
      context.font = `${this.size}px serif`;
      context.fillText(this.emoji, this.x, this.y);
    } else {
      context.translate(this.x, this.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.fillStyle = this.color;
      context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.4);
    }
    context.restore();
  }
}

function burstConfetti(x, y, count = 80) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, 'confetti'));
  }
  startParticleLoop();
}

function spawnFloatingHearts() {
  const x = Math.random() * window.innerWidth;
  const y = window.innerHeight + 20;
  particles.push(new Particle(x, y, 'heart'));
}

let floatingHeartInterval = null;
function toggleFloatingHearts(enable) {
  if (enable) {
    if (!floatingHeartInterval) {
      floatingHeartInterval = setInterval(spawnFloatingHearts, 260);
      startParticleLoop();
    }
  } else {
    clearInterval(floatingHeartInterval);
    floatingHeartInterval = null;
  }
}

function startParticleLoop() {
  if (!animFrameId) {
    loopParticles();
  }
}

function loopParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(ctx);
    if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
      particles.splice(i, 1);
    }
  }

  if (particles.length > 0 || floatingHeartInterval) {
    animFrameId = requestAnimationFrame(loopParticles);
  } else {
    animFrameId = null;
  }
}

// DOM Elements
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const step4 = document.getElementById('step-4');

const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const dodgeCounter = document.getElementById('dodge-counter');
const subtitle1 = document.getElementById('subtitle-1');
const actionsContainer = document.getElementById('actions-container');

const btnGoToPlan = document.getElementById('btn-go-to-plan');
const inputDate = document.getElementById('input-date');
const inputTime = document.getElementById('input-time');
const planChips = document.querySelectorAll('.plan-chip');
const btnSeal = document.getElementById('btn-seal');

const letterSalutation = document.getElementById('letter-salutation');
const letterAuthor = document.getElementById('letter-author');
const chipDate = document.getElementById('chip-date');
const chipTime = document.getElementById('chip-time');
const chipPlan = document.getElementById('chip-plan');
const letterDetailsText = document.getElementById('letter-details-text');
const btnWhatsapp = document.getElementById('btn-whatsapp');
const btnShare = document.getElementById('btn-share');
const btnRestart = document.getElementById('btn-restart');

const btnCustomize = document.getElementById('btn-customize');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const inputModalHer = document.getElementById('modal-her-name');
const inputModalHis = document.getElementById('modal-his-name');
const inputModalPhone = document.getElementById('modal-phone');
const btnSaveModal = document.getElementById('btn-save-modal');
const btnCopyLink = document.getElementById('btn-copy-link');
const btnMute = document.getElementById('btn-mute');
const toastMsg = document.getElementById('toast-msg');

// Set Initial Default Date (Next Saturday) & Time
function setInitialDateTimeDefaults() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  // Calculate days until next Saturday (day 6)
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  const targetDate = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
  
  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');
  
  state.selectedDate = `${yyyy}-${mm}-${dd}`;
  state.selectedTime = '19:30';
  
  if (inputDate) inputDate.value = state.selectedDate;
  if (inputTime) inputTime.value = state.selectedTime;
}

// Show Toast Notification
function showToast(text) {
  toastMsg.textContent = text;
  toastMsg.classList.add('show');
  setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 2500);
}

// Switch Steps
function goToStep(stepNum) {
  state.currentStep = stepNum;
  document.querySelectorAll('.step-view').forEach(view => view.classList.remove('active'));
  
  toggleFloatingHearts(false);

  if (stepNum === 1) {
    step1.classList.add('active');
  } else if (stepNum === 2) {
    step2.classList.add('active');
    soundFX.celebrate();
    const rect = btnYes.getBoundingClientRect();
    burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
  } else if (stepNum === 3) {
    step3.classList.add('active');
  } else if (stepNum === 4) {
    step4.classList.add('active');
    soundFX.letterOpen();
    toggleFloatingHearts(true);
    renderLetter();
  }
}

// Dodge logic with safe boundaries inside the card
function dodgeNoButton() {
  state.dodgeCount++;
  soundFX.dodge();

  // Show dodge counter badge
  dodgeCounter.textContent = `${state.dodgeCount} ${state.dodgeCount === 1 ? 'dodge' : 'dodges'}`;
  dodgeCounter.classList.add('visible');

  // Change subtitle dynamically
  const subtitleIndex = (state.dodgeCount - 1) % dodgeSubtitles.length;
  subtitle1.textContent = dodgeSubtitles[subtitleIndex];
  subtitle1.style.color = '#e05a53';

  // Change "No" button label
  const labelIndex = (state.dodgeCount - 1) % dodgeBtnLabels.length;
  btnNo.textContent = dodgeBtnLabels[labelIndex];

  // Scale down "No" button slightly
  const currentScale = Math.max(0.72, 1 - state.dodgeCount * 0.035);
  btnNo.style.transform = `scale(${currentScale})`;

  // Make "YES" button grow slightly
  const yesScale = Math.min(1.22, 1 + state.dodgeCount * 0.025);
  btnYes.style.transform = `scale(${yesScale})`;

  // Calculate random position within the container bounds
  const cardRect = document.getElementById('app-card').getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();
  
  // Calculate relative safe boundaries within the card
  const minX = 20;
  const maxX = cardRect.width - btnRect.width - 24;
  const minY = -140; // can hop into flower area
  const maxY = 15;

  const randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;

  btnNo.style.position = 'absolute';
  btnNo.style.left = `${randomX}px`;
  btnNo.style.top = `${randomY}px`;
  btnNo.style.right = 'auto';
}

// Proximity detection on Desktop & Touch
function checkDodgeProximity(clientX, clientY) {
  if (state.currentStep !== 1) return;
  const rect = btnNo.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;
  const dist = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);

  if (dist < 72) {
    dodgeNoButton();
  }
}

document.addEventListener('mousemove', (e) => {
  checkDodgeProximity(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    checkDodgeProximity(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

// Mobile & direct pointer events
btnNo.addEventListener('mouseenter', dodgeNoButton);
btnNo.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  dodgeNoButton();
});
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  dodgeNoButton();
}, { passive: false });
btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  dodgeNoButton();
});

// Yes button clicked
btnYes.addEventListener('click', () => {
  goToStep(2);
});

// Step 2 -> Step 3
btnGoToPlan.addEventListener('click', () => {
  soundFX.click();
  goToStep(3);
});

// Step 3: Planner Selection
planChips.forEach(chip => {
  chip.addEventListener('click', () => {
    soundFX.click();
    planChips.forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    state.selectedPlan = chip.getAttribute('data-plan');
    updateSealButtonState();
  });
});

inputDate.addEventListener('change', () => {
  state.selectedDate = inputDate.value;
  updateSealButtonState();
});

inputTime.addEventListener('change', () => {
  state.selectedTime = inputTime.value;
  updateSealButtonState();
});

function updateSealButtonState() {
  if (state.selectedDate && state.selectedPlan) {
    btnSeal.disabled = false;
    btnSeal.textContent = 'Seal it with a letter 💌';
  } else {
    btnSeal.disabled = true;
    btnSeal.textContent = 'Pick day, time & plan ✍️';
  }
}

btnSeal.addEventListener('click', () => {
  goToStep(4);
});

// Step 4: Render Final Letter
function formatReadableDate(dateString) {
  if (!dateString) return 'Soon';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
}

function formatReadableTime(timeString) {
  if (!timeString) return 'evening';
  try {
    const [hourStr, minStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minStr} ${ampm}`;
  } catch (e) {
    return timeString;
  }
}

function renderLetter() {
  const formattedDate = formatReadableDate(state.selectedDate);
  const formattedTime = formatReadableTime(state.selectedTime);

  letterSalutation.textContent = `Dear ${state.herName},`;
  letterAuthor.textContent = `~ ${state.hisName} ❤️`;

  chipDate.textContent = `📅 ${formattedDate}`;
  chipTime.textContent = `⏰ ${formattedTime}`;
  chipPlan.textContent = state.selectedPlan;

  letterDetailsText.textContent = `Let's meet ${formattedDate} at ${formattedTime}, for ${state.selectedPlan.toLowerCase()}.`;

  // Update WhatsApp link
  const messageText = `Hey ${state.hisName}! 🥰 I said YES! Our date is set for ${formattedDate} at ${formattedTime} for ${state.selectedPlan}. Can't wait! ❤️✨`;
  
  let waUrl = '';
  if (state.phoneNumber && state.phoneNumber.trim().length > 3) {
    const cleanNumber = state.phoneNumber.replace(/[^\d]/g, '');
    waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
  } else {
    waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
  }
  btnWhatsapp.setAttribute('href', waUrl);
}

// Share Button
btnShare.addEventListener('click', async () => {
  soundFX.click();
  const formattedDate = formatReadableDate(state.selectedDate);
  const formattedTime = formatReadableTime(state.selectedTime);
  const shareText = `It's official! Date confirmed with ${state.hisName} on ${formattedDate} at ${formattedTime} for ${state.selectedPlan}! 🥰🥂`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "It's a date! 💌",
        text: shareText,
        url: window.location.href
      });
      return;
    } catch (err) {}
  }

  // Fallback: copy to clipboard
  navigator.clipboard.writeText(shareText).then(() => {
    showToast('Plan copied to clipboard! 📋✨');
  }).catch(() => {
    showToast('Could not copy automatically');
  });
});

// Restart button
btnRestart.addEventListener('click', () => {
  state.dodgeCount = 0;
  btnNo.style = '';
  btnNo.textContent = 'No';
  btnYes.style = '';
  subtitle1.textContent = 'Catch No if you can.';
  subtitle1.style.color = '';
  dodgeCounter.classList.remove('visible');
  goToStep(1);
});

// Sound Mute Toggle
btnMute.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  btnMute.textContent = state.soundEnabled ? '🔊 Sound' : '🔇 Muted';
  showToast(state.soundEnabled ? 'Sound effects enabled 🎵' : 'Sound muted 🔇');
});

// Customization Modal Logic
function openCustomizeModal() {
  inputModalHer.value = state.herName === 'You' ? '' : state.herName;
  inputModalHis.value = state.hisName === 'Me' ? '' : state.hisName;
  inputModalPhone.value = state.phoneNumber || '';
  modalOverlay.classList.add('open');
}

function closeCustomizeModal() {
  modalOverlay.classList.remove('open');
}

btnCustomize.addEventListener('click', openCustomizeModal);
modalClose.addEventListener('click', closeCustomizeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeCustomizeModal();
});

btnSaveModal.addEventListener('click', () => {
  state.herName = inputModalHer.value.trim() || 'You';
  state.hisName = inputModalHis.value.trim() || 'Me';
  state.phoneNumber = inputModalPhone.value.trim();
  closeCustomizeModal();
  renderLetter();
  showToast('Settings saved! 💕');
});

btnCopyLink.addEventListener('click', () => {
  const url = new URL(window.location.origin + window.location.pathname);
  if (inputModalHer.value.trim()) url.searchParams.set('to', inputModalHer.value.trim());
  if (inputModalHis.value.trim()) url.searchParams.set('from', inputModalHis.value.trim());
  if (inputModalPhone.value.trim()) url.searchParams.set('phone', inputModalPhone.value.trim());

  navigator.clipboard.writeText(url.toString()).then(() => {
    showToast('Personalized link copied! 🔗 Send it to her!');
  });
});

// Read URL Query Params on Load
function parseQueryParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('to')) state.herName = params.get('to');
  if (params.get('from')) state.hisName = params.get('from');
  if (params.get('phone')) state.phoneNumber = params.get('phone');
}

// Initial Boot
window.addEventListener('DOMContentLoaded', () => {
  parseQueryParams();
  setInitialDateTimeDefaults();
  updateSealButtonState();
});
