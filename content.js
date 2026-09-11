// Phrase Matcher Dictionary
const MOOD_PHRASES = {
  phase1: [
    // Original core
    "love you", "miss you", "can't wait", "so cute", "hahaha", "lmao",
    "babe", "baby", "sweetheart", "mwah", "❤️", "🥰", "😘", "😊", " yay",
    // Expanded Affection & Warmth
    "ilysfm", "ily", "love u", "miss u", "cant wait to see u", "thinking of u",
    "you're the best", "ure the best", "so proud of u", "hug", "hugs", "xoxo",
    "good morning sunshine", "sweet dreams", "goodnight babe", "sleep well ❤️",
    "thank you baby", "tysm babe", "you're so sweet", "cutie", "handsome", "gorgeous",
    // Expanded Joy & Laughter
    "hahahaha", "hahahah", "ahahah", "rofl", "lollll", "lmaoofff", "dead 💀",
    "that's hilarious", "u make me so happy", "aww", "awwww", "omg yay",
    "woohoo", "can't stop smiling", "best day ever", "yayyy", "yesss",
    // Expanded Emojis & Symbols
    "💖", "💕", "💗", "💓", "💞", "🥺", "😍", "😻", "🙈", "✨", "☀️", "💋"
  ],

  phase2: [
    // Original core
    "sure", "sounds good", "let me know", "at work", "eating now",
    "cool", "alright", "on my way", "heading out", "almost there", "👍",
    // Expanded Logistics & Status Updates
    "omw", "heading back", "leaving now", "in a meeting", "just got home",
    "grabbing lunch", "grabbing food", "running late", "stuck in traffic",
    "at the gym", "cooking dinner", "taking a shower", "brb", "back in 5",
    "getting ready", "on the bus", "on the train", "just woke up",
    // Expanded Casual Acknowledgment & Planning
    "sounds like a plan", "makes sense", "got it", "copy that", "no problem",
    "no worries", "all good", "yep", "yeah", "yea", "yup", "sure thing",
    "let's do it", "works for me", "what time", "where at", "see you soon",
    "see ya", "talk later", "ttyl", "check your email", "sent", "done",
    // Expanded Emojis
    "👌", "🙌", "🚗", "💼", "🍽️", "⏰", "✌️", "🤝"
  ],

  phase3: [
    // Original core
    "k", "fine", "ok", "whatever", "if you say so", "as you wish",
    "do what you want", "up to you", "nevermind", "nvm", "cool.", "sure.",
    // Expanded Passive-Aggressive Short Drops
    "kk", "k.", "ok.", "fine.", "whatever.", "mkay", "k fine", "sure thing.",
    "glad to hear", "good for you", "must be nice", "good to know",
    "if you think so", "have fun", "enjoy", "go ahead", " suit yourself",
    // Expanded Cold Distance & Avoidance
    "i guess", "i suppose", "doesn't matter", "it's fine", "its fine",
    "don't worry about it", "forget i asked", "forget it.", "nvm then",
    "nothing", "im fine", "i'm fine.", "all good.", "nothing to talk about",
    "anyway", "anyways", "right", "uh huh", "cool story",
    // Expanded Emojis / Punctuation
    "🙂", "🙃", "😐", "😶", "🙄", "😒"
  ],

  phase4: [
    // Original core
    "why", "stop", "leave me alone", "are you serious", "forget it",
    "don't talk to me", "busy", "what do you want", "seriously", "ugh",
    // Expanded Anger & Frustration
    "shut up", "shut the fuck up", "stfu", "wtf", "what the hell", "what the fuck",
    "are u kidding me", "are you fucking serious", "ur annoying", "you're annoying",
    "leave me be", "get lost", "get out", "stop messaging me", "stop texting me",
    "i don't care", "idgaf", "idc", "i don't give a damn", "sick of this",
    // Expanded Accusatory & Irritated
    "why are you being like this", "what is wrong with you", "what's your problem",
    "you always do this", "here we go again", "don't start", "not this again",
    "i'm so annoyed", "im pissed", "you ruined my day", "unbelievable",
    "don't bother", "waste of time", "i can't deal with this",
    // Expanded Emojis
    "🤬", "😡", "😠", "😤", "🖕", "🤦‍♂️", "🤦‍♀️"
  ],

  phase5: [
    // Original core
    "we need to talk", "who is she", "answer your phone", "where are you",
    "call me right now", "is this a joke", "i'm done", "we are done",
    // Expanded DEFCON 1 / Relationship Threats
    "we're done", "were done", "it's over", "its over", "pack your stuff",
    "don't come home", "i want a breakup", "i want a divorce", "lose my number",
    "block me", "i blocked you", "never speak to me again", "get out of my house",
    // Expanded Suspicion & Crisis Demands
    "who is he", "who were you with", "who is that", "don't lie to me",
    "i know what you did", "i saw your phone", "explain this right now",
    "answer me", "answer right now", "pick up", "pick up the phone",
    "where the fuck are you", "why aren't you answering", "you lied to me",
    // Expanded Emojis & Alerts
    "🚨", "⚠️", "🆘", "‼️", "❓"
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