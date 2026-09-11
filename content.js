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

  img.classList.add("fade-out");

  setTimeout(() => {
    img.src = chrome.runtime.getURL(`phase${phase}.png`);
    label.innerText = labels[phase];
    img.classList.remove("fade-out");
  }, 250);
}

function checkLatestMessage() {
  // 1. Locate the main chat conversation panel specifically
  const mainPanel = document.querySelector('#main');
  if (!mainPanel) return;

  // 2. Select all text spans inside #main, excluding the input footer
  const allSpans = Array.from(mainPanel.querySelectorAll('span'));
  if (allSpans.length === 0) return;

  const chatBounds = mainPanel.getBoundingClientRect();
  const chatMidpoint = chatBounds.left + (chatBounds.width / 2);

  // Scan backwards starting from the bottom of the conversation
  for (let i = allSpans.length - 1; i >= 0; i--) {
    const span = allSpans[i];

    // IGNORE any span inside the input footer or reply box
    if (span.closest('footer') || span.closest('div[contenteditable="true"]')) {
      continue;
    }

    const text = span.innerText ? span.innerText.trim() : "";

    // Ignore empty text, timestamps (e.g., 8:16 pm), or single status icons
    if (text.length > 0 && !text.match(/^\d{1,2}:\d{2}(\s?[ap]m)?$/i)) {
      const rect = span.getBoundingClientRect();

      // Ensure the element is actually visible on screen inside the chat
      if (rect.width > 0 && rect.height > 0) {
        
        // Incoming messages sit on the LEFT half of #main
        // Outgoing messages sit on the RIGHT half of #main
        const isIncoming = rect.left < chatMidpoint && rect.left > chatBounds.left;

        if (isIncoming) {
          const phase = evaluatePhase(text);
          updateMoodUI(phase);
          break; // Found the latest incoming message from her!
        }
      }
    }
  }
}

function init() {
  createWidget();
  setInterval(checkLatestMessage, 1000);
}

window.addEventListener("load", () => {
  setTimeout(init, 3000);
});