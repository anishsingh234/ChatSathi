(function () {
  const scriptTag = document.currentScript || document.querySelector('script[src*="chatBot.js"]');
  if (!scriptTag) {
    console.error("ChatBot script tag not found");
    return;
  }
  const ownerId = scriptTag.getAttribute("data-owner-id");
  const scriptSrc = scriptTag.getAttribute("src") || "";
  const baseUrl = scriptSrc.replace(/\/chatBot\.js.*$/, "");
  const api_Url = baseUrl + "/api/chat";

  if (!ownerId) {
    console.log("owner is not found");
    return;
  }

  // ─── THEME CONFIG (fetched from server) ───
  const configUrl = baseUrl + "/api/widget-config?ownerId=" + ownerId;
  let themeConfig = {
    primaryColor: "#7c3aed",
    headerBg: "#0f0e17",
    botBubbleBg: "rgba(255,255,255,0.05)",
    userBubbleGrad1: "#635bff",
    userBubbleGrad2: "#8b5cf6",
    chatBg: "#0f0e17",
    welcomeMessage: "Hey! 👋 How can I help you today?",
    chatTitle: "ChatSathi",
  };

  // Fetch theme and then initialize widget
  fetch(configUrl)
    .then(function (r) { return r.json(); })
    .then(function (cfg) {
      if (cfg && cfg.primaryColor) themeConfig = cfg;
    })
    .catch(function () { /* use defaults */ })
    .finally(function () { initWidget(); });

  function initWidget() {
  // ─── APPLY THEME as CSS custom properties ───
  function applyTheme() {
    var root = document.documentElement;
    root.style.setProperty('--cs-primary', themeConfig.primaryColor);
    root.style.setProperty('--cs-header-bg', themeConfig.headerBg);
    root.style.setProperty('--cs-bot-bubble-bg', themeConfig.botBubbleBg);
    root.style.setProperty('--cs-user-grad1', themeConfig.userBubbleGrad1);
    root.style.setProperty('--cs-user-grad2', themeConfig.userBubbleGrad2);
    root.style.setProperty('--cs-chat-bg', themeConfig.chatBg);
  }
  applyTheme();

  // ─── VISITOR ID (persistent) ───
  function getVisitorId() {
    let vid = localStorage.getItem("cs_visitor_id");
    if (!vid) {
      vid = "v_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem("cs_visitor_id", vid);
    }
    return vid;
  }
  const visitorId = getVisitorId();

  // ─── GOOGLE FONTS ───
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap";
  document.head.appendChild(fontLink);

  // ─── GLOBAL STYLES ───
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --cs-primary: #7c3aed;
      --cs-header-bg: #0f0e17;
      --cs-bot-bubble-bg: rgba(255,255,255,0.05);
      --cs-user-grad1: #635bff;
      --cs-user-grad2: #8b5cf6;
      --cs-chat-bg: #0f0e17;
      --cs-text-main: #fcfcfc;
      --cs-text-muted: rgba(255,255,255,0.6);
      --cs-border: rgba(255,255,255,0.08);
      --cs-shadow: 0 12px 40px rgba(0,0,0,0.25);
    }
    .cs-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; }

    @keyframes cs-in { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes cs-fab-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
    @keyframes cs-dot { 0%, 100% { transform: scale(0.8); opacity: 0.4; } 50% { transform: scale(1.2); opacity: 1; } }

    .cs-fab {
      position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px;
      border-radius: 28px; background: var(--cs-primary);
      box-shadow: 0 8px 24px color-mix(in srgb, var(--cs-primary) 40%, transparent);
      color: #fff; display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 999999; animation: cs-fab-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cs-fab:hover { transform: scale(1.05); }
    .cs-fab svg { transition: transform 0.3s; }

    .cs-box {
      position: fixed; bottom: 96px; right: 24px; width: 380px; height: 600px; max-height: calc(100vh - 120px);
      background: var(--cs-chat-bg); border-radius: 20px;
      border: 1px solid var(--cs-border); box-shadow: var(--cs-shadow);
      display: none; flex-direction: column; overflow: hidden; z-index: 999999;
      transform-origin: bottom right;
    }

    .cs-header {
      padding: 20px 24px; border-bottom: 1px solid var(--cs-border);
      display: flex; align-items: center; gap: 14px; background: var(--cs-header-bg); flex-shrink: 0;
    }
    .cs-avatar {
      width: 40px; height: 40px; border-radius: 20px;
      background: color-mix(in srgb, var(--cs-primary) 15%, transparent);
      display: flex; align-items: center; justify-content: center; color: var(--cs-primary); flex-shrink: 0;
    }
    .cs-name { font-size: 15px; font-weight: 600; color: var(--cs-text-main); letter-spacing: -0.01em; }
    .cs-status { font-size: 12px; color: var(--cs-text-muted); margin-top: 2px; display: flex; align-items: center; gap: 6px; }
    .cs-dot-live { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
    .cs-close {
      margin-left: auto; width: 32px; height: 32px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--cs-text-muted); transition: background 0.2s, color 0.2s; flex-shrink: 0;
    }
    .cs-close:hover { background: rgba(255,255,255,0.08); color: var(--cs-text-main); }

    .cs-messages {
      flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth;
    }
    .cs-messages::-webkit-scrollbar { width: 4px; }
    .cs-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

    .cs-msg-row { display: flex; gap: 10px; align-items: flex-end; animation: cs-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .cs-msg-row.user { flex-direction: row-reverse; }
    .cs-msg-row > div:not(.cs-msg-avatar) { max-width: 82%; display: flex; flex-direction: column; }
    .cs-msg-row.user > div:not(.cs-msg-avatar) { align-items: flex-end; }
    .cs-msg-row.ai > div:not(.cs-msg-avatar), .cs-msg-row.admin > div:not(.cs-msg-avatar) { align-items: flex-start; }

    .cs-msg-avatar {
      width: 28px; height: 28px; border-radius: 14px;
      background: color-mix(in srgb, var(--cs-primary) 15%, transparent); color: var(--cs-primary);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .cs-bubble {
      padding: 12px 16px; font-size: 14px; line-height: 1.5; border-radius: 18px; 
      overflow-wrap: anywhere; word-break: normal; white-space: pre-wrap;
    }
    .cs-bubble.ai {
      background: var(--cs-bot-bubble-bg); color: var(--cs-text-main); border-bottom-left-radius: 4px;
    }
    .cs-bubble.user {
      background: linear-gradient(135deg, var(--cs-user-grad1), var(--cs-user-grad2)); color: #fff; border-bottom-right-radius: 4px;
    }

    .cs-typing-dots { display: flex; gap: 4px; padding: 4px 2px; }
    .cs-typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: var(--cs-text-muted); animation: cs-dot 1.4s infinite; }
    .cs-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .cs-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

    .cs-footer {
      padding: 16px 24px 24px; display: flex; gap: 10px; align-items: center; flex-shrink: 0; background: var(--cs-chat-bg);
    }
    .cs-input {
      flex: 1; padding: 14px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--cs-border);
      border-radius: 14px; font-size: 14px; color: var(--cs-text-main); outline: none; transition: border-color 0.2s, background 0.2s;
    }
    .cs-input::placeholder { color: var(--cs-text-muted); }
    .cs-input:focus { border-color: var(--cs-primary); background: rgba(255,255,255,0.08); }

    .cs-send {
      width: 44px; height: 44px; border-radius: 14px; background: var(--cs-primary); border: none;
      color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: opacity 0.2s, transform 0.1s;
    }
    .cs-send:hover { opacity: 0.9; }
    .cs-send:active { transform: scale(0.95); }

    .cs-timestamp { font-size: 11px; color: var(--cs-text-muted); text-align: center; margin: 8px 0; font-weight: 500; }

    @keyframes cs-popup-in { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes cs-popup-out { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(12px) scale(0.96); } }

    .cs-popup {
      position: fixed; bottom: 96px; right: 24px; z-index: 999998; animation: cs-popup-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; cursor: pointer;
    }
    .cs-popup.hiding { animation: cs-popup-out 0.25s ease forwards; }
    .cs-popup-card {
      background: var(--cs-chat-bg); border: 1px solid var(--cs-border); border-radius: 20px;
      box-shadow: var(--cs-shadow); padding: 20px; width: 280px; position: relative;
    }
    .cs-popup-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .cs-popup-avatar {
      width: 36px; height: 36px; border-radius: 18px; background: color-mix(in srgb, var(--cs-primary) 15%, transparent);
      display: flex; align-items: center; justify-content: center; color: var(--cs-primary); flex-shrink: 0;
    }
    .cs-popup-brand { font-size: 14px; font-weight: 600; color: var(--cs-text-main); }
    
    .cs-popup-msg { font-size: 14px; line-height: 1.5; color: var(--cs-text-muted); margin-bottom: 16px; }
    .cs-popup-msg strong { color: var(--cs-text-main); font-weight: 600; }
    
    .cs-popup-cta { display: flex; gap: 8px; flex-wrap: wrap; }
    .cs-popup-chip {
      font-size: 13px; font-weight: 500; padding: 6px 14px; border-radius: 20px;
      background: color-mix(in srgb, var(--cs-primary) 15%, transparent); color: color-mix(in srgb, var(--cs-primary) 100%, white);
      transition: background 0.2s, color 0.2s; white-space: nowrap;
    }
    .cs-popup-chip:hover { background: var(--cs-primary); color: #fff; }
    
    .cs-popup-dismiss {
      position: absolute; top: 16px; right: 16px; width: 24px; height: 24px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--cs-text-muted); transition: background 0.2s;
    }
    .cs-popup-dismiss:hover { background: rgba(255,255,255,0.08); color: var(--cs-text-main); }

    @media (max-width: 480px) {
      .cs-box { width: 100vw; height: 100dvh; max-height: 100dvh; bottom: 0; right: 0; border-radius: 0; border: none; }
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
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="cs-popup-header">
        <div class="cs-popup-avatar">
          ${iconBot(18)}
        </div>
        <div class="cs-popup-brand">${themeConfig.chatTitle}</div>
      </div>
      <div class="cs-popup-msg">
        <strong>Hey there! 👋</strong><br>
        How can I help you today?
      </div>
      <div class="cs-popup-cta">
        <span class="cs-popup-chip" data-msg="What services do you offer?">Our services</span>
        <span class="cs-popup-chip" data-msg="How do I get started?">Get started</span>
      </div>
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
        ${iconBot(20)}
      </div>
      <div>
        <div class="cs-name">${themeConfig.chatTitle}</div>
        <div class="cs-status"><span class="cs-dot-live"></span>We typically reply in minutes</div>
      </div>
      <div class="cs-close" id="cs-close" aria-label="Close chat">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <div class="cs-messages" id="cs-messages">
      <div class="cs-timestamp">${timeStr}</div>
      <div class="cs-msg-row ai">
        <div class="cs-msg-avatar">${iconBot(14)}</div>
        <div class="cs-bubble ai">${themeConfig.welcomeMessage}</div>
      </div>
    </div>
    <div class="cs-footer">
      <input class="cs-input" id="cs-input" type="text" placeholder="Write a message..." autocomplete="off" />
      <button class="cs-send" id="cs-send" aria-label="Send message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

  function iconBot(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
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

    if (from === "ai" || from === "admin") {
      const av = document.createElement("div");
      av.className = "cs-msg-avatar";
      if (from === "admin") {
        av.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
        av.style.background = "#d1fae5";
        av.style.borderColor = "#a7f3d0";
      } else {
        av.innerHTML = iconBot(12);
      }
      row.appendChild(av);
    }

    const bubbleWrapper = document.createElement("div");
    
    if (from === "admin") {
      const badge = document.createElement("div");
      badge.style.fontSize = "10px";
      badge.style.color = "#10b981";
      badge.style.fontWeight = "600";
      badge.style.marginBottom = "4px";
      badge.innerHTML = "Admin Reply";
      bubbleWrapper.appendChild(badge);
    }

    const bubble = document.createElement("div");
    bubble.className = `cs-bubble ${from === "admin" ? "ai" : from}`;
    if (from === "admin") {
      bubble.style.background = "#ecfdf5";
      bubble.style.borderColor = "#d1fae5";
      bubble.style.color = "#064e3b";
    }
    bubble.innerHTML = text;
    bubbleWrapper.appendChild(bubble);

    row.appendChild(bubbleWrapper);

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

  let activeConversationId = null;
  let lastMessageAt = new Date().toISOString();
  let pollInterval = null;

  function startPolling() {
    if (pollInterval || !activeConversationId) return;
    pollInterval = setInterval(async () => {
      if (!isOpen) return; // Only poll when box is open
      try {
        const res = await fetch(`${baseUrl}/api/conversations/${activeConversationId}/messages?after=${lastMessageAt}`);
        if (!res.ok) return;
        const messages = await res.json();
        
        if (messages.length > 0) {
          messages.forEach(m => {
            // Only show admin messages (user messages are already in UI, bot messages come from main response)
            if (m.role === "admin") {
              addTimestamp();
              addMessage(m.content, "admin");
            }
          });
          lastMessageAt = messages[messages.length - 1].createdAt;
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000); // Poll every 5s
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
        body: JSON.stringify({ ownerId, message: text, visitorId }),
      });
      const data = await res.json();
      removeTyping();
      
      const responseText = data.text || data.message || "Something went wrong. Please try again.";
      addMessage(responseText, "ai");
      lastMessageAt = new Date().toISOString();

      if (data.conversationId) {
        activeConversationId = data.conversationId;
        startPolling();
      }

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
  } // end initWidget
})();