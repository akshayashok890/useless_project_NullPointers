// Phrase Matcher Dictionary
const MOOD_PHRASES = {
  phase1: [
    "love you", "miss you", "can't wait", "so cute", "hahaha", "lmao",
    "babe", "baby", "sweetheart", "mwah", "❤️", "🥰", "😘", "😊", " yay"
  ],
  phase2: [
    "sure", "sounds good", "let me know", "at work", "eating now",
    "cool", "alright", "on my way", "heading out", "almost there", "👍"
  ],
  phase3: [
    "k", "fine", "ok", "whatever", "if you say so", "as you wish",
    "do what you want", "up to you", "nevermind", "nvm", "cool.", "sure."
  ],
  phase4: [
    "why", "stop", "leave me alone", "are you serious", "forget it",
    "don't talk to me", "busy", "what do you want", "seriously", "ugh"
  ],
  phase5: [
    "we need to talk", "who is she", "answer your phone", "where are you",
    "call me right now", "is this a joke", "i'm done", "we are done"
  ]
};

let currentPhase = 1;

function evaluatePhase(text) {
  const clean = text.toLowerCase().trim();

  if (MOOD_PHRASES.phase5.some(p => clean.includes(p))) return 5;
  if (["k", "fine", "ok", "cool.", "sure."].includes(clean)) return 3;
  if (MOOD_PHRASES.phase4.some(p => clean.includes(p))) return 4;
  if (MOOD_PHRASES.phase3.some(p => clean.includes(p))) return 3;
  if (MOOD_PHRASES.phase1.some(p => clean.includes(p))) return 1;

  return 2;
}

function createWidget() {
  if (document.getElementById("uncanny-widget")) return;

  const container = document.createElement("div");
  container.id = "uncanny-widget";

  const img = document.createElement("img");
  img.id = "uncanny-img";
  img.src = chrome.runtime.getURL("phase1.png");

  const label = document.createElement("div");
  label.id = "uncanny-label";
  label.innerText = "Mood: Happy";

  container.appendChild(img);
  container.appendChild(label);
  document.body.appendChild(container);
}

function updateMoodUI(phase) {
  if (phase === currentPhase) return;
  currentPhase = phase;

  const img = document.getElementById("uncanny-img");
  const label = document.getElementById("uncanny-label");
  if (!img || !label) return;

  const labels = {
    1: "Mood: Happy",
    2: "Mood: Neutral",
    3: "Mood: Cold / Passive",
    4: "Mood: Angry",
    5: "DEFCON 1: RUN"
  };

  // Fade Out
  img.classList.add("fade-out");

  // Swap Source and Fade Back In after 250ms
  setTimeout(() => {
    img.src = chrome.runtime.getURL(`phase${phase}.png`);
    label.innerText = labels[phase];
    img.classList.remove("fade-out");
  }, 250);
}

function getLatestIncomingMessage() {
  // Target incoming message wrappers dynamically regardless of obfuscated classes
  const incomingMessages = document.querySelectorAll('div[class*="message-in"]');
  if (incomingMessages.length > 0) {
    const lastMsg = incomingMessages[incomingMessages.length - 1];
    return lastMsg.innerText;
  }

  // Fallback to text span selectors inside WhatsApp Web
  const selectableSpans = document.querySelectorAll('span._ao3e, span.selectable-text, div._am3n');
  if (selectableSpans.length > 0) {
    return selectableSpans[selectableSpans.length - 1].innerText;
  }

  return "";
}

function observeWhatsApp() {
  const observer = new MutationObserver(() => {
    const lastText = getLatestIncomingMessage();
    if (lastText) {
      const phase = evaluatePhase(lastText);
      updateMoodUI(phase);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    createWidget();
    observeWhatsApp();
  }, 3000);
});