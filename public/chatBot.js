(function () {
  const api_Url = "https://chat-sathi.vercel.app/api/chat";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.log("owner is not found");
    return;
  }

  // ─── GOOGLE FONTS ───
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap";
  document.head.appendChild(fontLink);

  // ─── GLOBAL STYLES ───
  const style = document.createElement("style");
  style.textContent = `
    .cs-widget * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes cs-dot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
      30% { transform: translateY(-5px); opacity: 1; }
    }
    @keyframes cs-in {
      from { opacity: 0; transform: translateY(8px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes cs-fab-in {
      from { opacity: 0; transform: scale(0.8) rotate(-15deg); }
      to   { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes cs-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(99,91,255,0.5); }
      50%       { box-shadow: 0 0 0 8px rgba(99,91,255,0); }
    }

    .cs-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 58px;
      height: 58px;
      border-radius: 18px;
      background: #0f0e17;
      border: 1.5px solid rgba(255,255,255,0.12);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999999;
      animation: cs-fab-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both, cs-pulse 2.5s 1s ease-in-out infinite;
      transition: border-color 0.2s, background 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    .cs-fab:hover {
      background: #1c1a2e;
      border-color: rgba(255,255,255,0.22);
      animation: none;
    }
    .cs-fab svg { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
    .cs-fab:hover svg { transform: scale(1.1); }

    .cs-box {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 388px;
      height: 540px;
      background: #0f0e17;
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      font-family: 'DM Sans', sans-serif;
      transform-origin: bottom right;
    }

    .cs-header {
      padding: 18px 20px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(160deg, rgba(99,91,255,0.15) 0%, transparent 70%);
      flex-shrink: 0;
    }
    .cs-avatar {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: rgba(99,91,255,0.2);
      border: 1px solid rgba(99,91,255,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cs-name { font-size: 14px; font-weight: 500; color: #f0eeff; letter-spacing: -0.01em; }
    .cs-status { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; display: flex; align-items: center; gap: 5px; font-family: 'DM Mono', monospace; letter-spacing: 0.02em; }
    .cs-dot-live { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 6px rgba(74,222,128,0.6); }
    .cs-close {
      margin-left: auto;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      transition: background 0.2s, color 0.2s;
      flex-shrink: 0;
    }
    .cs-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

    .cs-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cs-messages::-webkit-scrollbar { width: 4px; }
    .cs-messages::-webkit-scrollbar-track { background: transparent; }
    .cs-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    .cs-msg-row {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      animation: cs-in 0.28s ease both;
    }
    .cs-msg-row.user { flex-direction: row-reverse; }

    .cs-msg-avatar {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      background: rgba(99,91,255,0.25);
      border: 1px solid rgba(99,91,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .cs-bubble {
      max-width: 76%;
      padding: 10px 14px;
      font-size: 13.5px;
      line-height: 1.55;
      border-radius: 16px;
      word-break: break-word;
    }
    .cs-bubble.ai {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.85);
      border-bottom-left-radius: 4px;
    }
    .cs-bubble.user {
      background: linear-gradient(135deg, #635bff 0%, #8b5cf6 100%);
      color: #fff;
      border-bottom-right-radius: 4px;
      font-weight: 400;
    }

    .cs-typing-dots {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 4px 0;
    }
    .cs-typing-dots span {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      display: inline-block;
      animation: cs-dot 1.2s ease infinite;
    }
    .cs-typing-dots span:nth-child(2) { animation-delay: 0.15s; }
    .cs-typing-dots span:nth-child(3) { animation-delay: 0.3s; }

    .cs-footer {
      padding: 12px 16px 16px;
      border-top: 1px solid rgba(255,255,255,0.07);
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    }
    .cs-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      font-size: 13.5px;
      font-family: 'DM Sans', sans-serif;
      color: #f0eeff;
      outline: none;
      caret-color: #635bff;
      transition: border-color 0.2s, background 0.2s;
      -webkit-text-fill-color: #f0eeff;
    }
    .cs-input::placeholder { color: rgba(255,255,255,0.25); }
    .cs-input:focus { border-color: rgba(99,91,255,0.6); background: rgba(99,91,255,0.07); }

    .cs-send {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #635bff;
      border: none;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
    }
    .cs-send:hover { background: #7a73ff; transform: scale(1.05); }
    .cs-send:active { transform: scale(0.96); }

    .cs-timestamp {
      font-size: 10px;
      color: rgba(255,255,255,0.2);
      font-family: 'DM Mono', monospace;
      text-align: center;
      letter-spacing: 0.04em;
      margin: -4px 0 2px;
    }

    @keyframes cs-popup-in {
      0%   { opacity: 0; transform: translateY(10px) scale(0.95); }
      60%  { opacity: 1; transform: translateY(-3px) scale(1.01); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes cs-popup-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(6px) scale(0.96); }
    }

    .cs-popup {
      position: fixed;
      bottom: 100px;
      right: 28px;
      z-index: 999998;
      font-family: 'DM Sans', sans-serif;
      animation: cs-popup-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
      cursor: pointer;
    }
    .cs-popup.hiding {
      animation: cs-popup-out 0.2s ease forwards;
    }
    .cs-popup-card {
      background: #0f0e17;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 18px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset;
      padding: 14px 16px 12px;
      width: 240px;
      position: relative;
    }
    .cs-popup-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .cs-popup-avatar {
      width: 28px; height: 28px;
      border-radius: 8px;
      background: rgba(99,91,255,0.2);
      border: 1px solid rgba(99,91,255,0.35);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .cs-popup-brand { font-size: 12px; font-weight: 500; color: #f0eeff; letter-spacing: -0.01em; }
    .cs-popup-badge {
      font-size: 9px;
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.06em;
      color: rgba(255,255,255,0.35);
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 2px 6px;
      border-radius: 20px;
      margin-left: auto;
      white-space: nowrap;
    }
    .cs-popup-msg {
      font-size: 13px;
      line-height: 1.5;
      color: rgba(255,255,255,0.75);
      margin-bottom: 10px;
    }
    .cs-popup-msg strong { color: #f0eeff; font-weight: 500; }
    .cs-popup-cta {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .cs-popup-chip {
      font-size: 11.5px;
      padding: 5px 10px;
      border-radius: 20px;
      background: rgba(99,91,255,0.15);
      border: 1px solid rgba(99,91,255,0.3);
      color: rgba(149,139,255,0.9);
      cursor: pointer;
      transition: background 0.18s, border-color 0.18s, color 0.18s;
      white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
    }
    .cs-popup-chip:hover {
      background: rgba(99,91,255,0.28);
      border-color: rgba(99,91,255,0.55);
      color: #c4bfff;
    }
    .cs-popup-dismiss {
      position: absolute;
      top: 10px; right: 10px;
      width: 20px; height: 20px;
      border-radius: 6px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: rgba(255,255,255,0.3);
      transition: background 0.15s, color 0.15s;
    }
    .cs-popup-dismiss:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); }
    .cs-popup-tail {
      position: absolute;
      bottom: -7px;
      right: 22px;
      width: 14px; height: 8px;
      overflow: visible;
    }

    @media (max-width: 480px) {
      .cs-box {
        width: 100vw !important;
        height: 100dvh !important;
        bottom: 0 !important;
        right: 0 !important;
        border-radius: 0 !important;
      }
      .cs-popup { right: 16px; bottom: 96px; }
    }
  `;
  document.head.appendChild(style);

  // ─── FAB BUTTON ───
  const fab = document.createElement("div");
  fab.className = "cs-fab cs-widget";
  fab.setAttribute("aria-label", "Open chat");
  fab.innerHTML = iconChat();
  document.body.appendChild(fab);

  // ─── WELCOME POPUP ───
  const popup = document.createElement("div");
  popup.className = "cs-popup cs-widget";
  popup.innerHTML = `
    <div class="cs-popup-card">
      <div class="cs-popup-dismiss" id="cs-popup-dismiss">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1L7 7M7 1L1 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </div>
      <div class="cs-popup-header">
        <div class="cs-popup-avatar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="18" height="11" rx="3" stroke="rgba(99,91,255,0.8)" stroke-width="1.6"/><path d="M9 14V15.5M15 14V15.5" stroke="rgba(99,91,255,0.8)" stroke-width="1.6" stroke-linecap="round"/><path d="M9 6V9M15 6V9" stroke="rgba(99,91,255,0.8)" stroke-width="1.6" stroke-linecap="round"/></svg>
        </div>
        <div class="cs-popup-brand">ChatSathi</div>
        <div class="cs-popup-badge">AI · powered</div>
      </div>
      <div class="cs-popup-msg">
        <strong>Hey there! 👋</strong><br>
        How can I help you today?
      </div>
      <div class="cs-popup-cta">
        <span class="cs-popup-chip" data-msg="What services do you offer?">Our services</span>
        <span class="cs-popup-chip" data-msg="How do I get started?">Get started</span>
        <span class="cs-popup-chip" data-msg="I need support">Get support</span>
      </div>
      <svg class="cs-popup-tail" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L7 8 L14 0" fill="#0f0e17"/>
        <path d="M0 0.5 L7 8 L14 0.5" stroke="rgba(255,255,255,0.12)" stroke-width="1" fill="none"/>
      </svg>
    </div>
  `;
  document.body.appendChild(popup);

  let popupDismissed = false;
  function dismissPopup() {
    if (popupDismissed) return;
    popupDismissed = true;
    popup.classList.add("hiding");
    setTimeout(() => popup.remove(), 220);
  }

  // dismiss X button
  popup.querySelector("#cs-popup-dismiss").addEventListener("click", (e) => {
    e.stopPropagation();
    dismissPopup();
  });

  // clicking the popup body opens chat
  popup.addEventListener("click", () => {
    dismissPopup();
    openBox();
  });

  // quick-reply chips
  popup.querySelectorAll(".cs-popup-chip").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      const msg = chip.getAttribute("data-msg");
      dismissPopup();
      openBox();
      setTimeout(() => {
        const inp = box.querySelector("#cs-input");
        if (inp) { inp.value = msg; inp.focus(); }
        setTimeout(() => box.querySelector("#cs-send")?.click(), 80);
      }, 320);
    });
  });

  // auto-dismiss after 12 s
  setTimeout(() => dismissPopup(), 12000);

  // ─── CHAT BOX ───
  const box = document.createElement("div");
  box.className = "cs-box cs-widget";

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  box.innerHTML = `
    <div class="cs-header">
      <div class="cs-avatar">
        ${iconBot()}
      </div>
      <div>
        <div class="cs-name">ChatSathi</div>
        <div class="cs-status"><span class="cs-dot-live"></span>online · ready</div>
      </div>
      <div class="cs-close" id="cs-close" aria-label="Close chat">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <div class="cs-messages" id="cs-messages">
      <div class="cs-timestamp">${timeStr}</div>
      <div class="cs-msg-row ai">
        <div class="cs-msg-avatar">${iconBot(12)}</div>
        <div class="cs-bubble ai">Hey! 👋 How can I help you today?</div>
      </div>
    </div>
    <div class="cs-footer">
      <input class="cs-input" id="cs-input" type="text" placeholder="Ask me anything…" autocomplete="off" />
      <button class="cs-send" id="cs-send" aria-label="Send message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(box);

  // ─── ICON HELPERS ───
  function iconChat() {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 10H16M8 14H13M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function iconClose() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  function iconBot(size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="9" width="18" height="11" rx="3" stroke="rgba(99,91,255,0.8)" stroke-width="1.6"/>
      <path d="M9 14V15.5M15 14V15.5" stroke="rgba(99,91,255,0.8)" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M9 6V9M15 6V9" stroke="rgba(99,91,255,0.8)" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M12 4C12 3.44772 12.4477 3 13 3H15C15.5523 3 16 3.44772 16 4V6H9V4C9 3.44772 9.44772 3 10 3H12Z" stroke="rgba(99,91,255,0.8)" stroke-width="1.6"/>
    </svg>`;
  }

  // ─── TOGGLE ───
  let isOpen = false;

  function openBox() {
    isOpen = true;
    dismissPopup();
    box.style.display = "flex";
    box.style.opacity = "0";
    box.style.transform = "scale(0.94) translateY(12px)";
    requestAnimationFrame(() => {
      box.style.transition = "opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)";
      box.style.opacity = "1";
      box.style.transform = "scale(1) translateY(0)";
    });
    fab.innerHTML = iconClose();
    fab.style.animation = "none";
    setTimeout(() => box.querySelector("#cs-input")?.focus(), 300);
  }

  function closeBox() {
    isOpen = false;
    box.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    box.style.opacity = "0";
    box.style.transform = "scale(0.94) translateY(12px)";
    setTimeout(() => { box.style.display = "none"; }, 200);
    fab.innerHTML = iconChat();
    fab.style.animation = "cs-pulse 2.5s ease-in-out infinite";
  }

  fab.onclick = () => (isOpen ? closeBox() : openBox());
  box.querySelector("#cs-close").onclick = closeBox;

  // ─── MESSAGING ───
  const msgArea = box.querySelector("#cs-messages");
  const input = box.querySelector("#cs-input");
  const sendBtn = box.querySelector("#cs-send");

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(text, from) {
    const row = document.createElement("div");
    row.className = `cs-msg-row ${from}`;

    if (from === "ai") {
      const av = document.createElement("div");
      av.className = "cs-msg-avatar";
      av.innerHTML = iconBot(12);
      row.appendChild(av);
    }

    const bubble = document.createElement("div");
    bubble.className = `cs-bubble ${from}`;
    bubble.innerHTML = text;
    row.appendChild(bubble);

    msgArea.appendChild(row);
    msgArea.scrollTop = msgArea.scrollHeight;
    return row;
  }

  function addTimestamp() {
    const ts = document.createElement("div");
    ts.className = "cs-timestamp";
    ts.textContent = getTime();
    msgArea.appendChild(ts);
  }

  let typingEl = null;
  function showTyping() {
    const row = document.createElement("div");
    row.className = "cs-msg-row ai";
    row.id = "cs-typing";

    const av = document.createElement("div");
    av.className = "cs-msg-avatar";
    av.innerHTML = iconBot(12);
    row.appendChild(av);

    const bubble = document.createElement("div");
    bubble.className = "cs-bubble ai";
    bubble.innerHTML = `<div class="cs-typing-dots"><span></span><span></span><span></span></div>`;
    row.appendChild(bubble);

    msgArea.appendChild(row);
    msgArea.scrollTop = msgArea.scrollHeight;
    typingEl = row;
  }

  function removeTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  // ─── SEND HANDLER ───
  async function send() {
    const text = input.value.trim();
    if (!text) return;

    addTimestamp();
    addMessage(text, "user");
    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.5";

    showTyping();

    try {
      const res = await fetch(api_Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, message: text }),
      });
      const data = await res.json();
      removeTyping();
      addMessage(data || "Something went wrong. Please try again.", "ai");
    } catch (err) {
      removeTyping();
      addMessage("Couldn't reach the server. Check your connection.", "ai");
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      sendBtn.style.opacity = "1";
      input.focus();
    }
  }

  sendBtn.onclick = send;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
})();