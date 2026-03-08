(function () {
  const api_Url = "https://chat-sathi.vercel.app/api/chat";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.log("owner is not found");
    return;
  }

  // ─── STYLES ───
  const COLORS = {
    primary: "#7c3aed",
    primaryDark: "#6d28d9",
    primaryLight: "#ede9fe",
    primaryGlow: "rgba(124, 58, 237, 0.25)",
    white: "#ffffff",
    bg: "#f8fafc",
    border: "#e2e8f0",
    borderLight: "#f1f5f9",
    text: "#1e293b",
    textMuted: "#64748b",
    textLight: "#94a3b8",
    userBubble: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
    aiBubble: "#ffffff",
  };

  const FONT =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif';

  // ─── CHAT BUTTON ───
  const button = document.createElement("div");
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;

  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: COLORS.primary,
    color: COLORS.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "24px",
    boxShadow: `0 8px 32px ${COLORS.primaryGlow}, 0 2px 8px rgba(0,0,0,0.1)`,
    zIndex: "999999",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: FONT,
  });

  button.onmouseenter = () => {
    button.style.transform = "scale(1.08)";
    button.style.boxShadow = `0 12px 40px ${COLORS.primaryGlow}, 0 4px 12px rgba(0,0,0,0.15)`;
  };
  button.onmouseleave = () => {
    button.style.transform = "scale(1)";
    button.style.boxShadow = `0 8px 32px ${COLORS.primaryGlow}, 0 2px 8px rgba(0,0,0,0.1)`;
  };

  document.body.appendChild(button);

  // ─── CHAT BOX ───
  const box = document.createElement("div");

  Object.assign(box.style, {
    position: "fixed",
    bottom: "100px",
    right: "24px",
    width: "380px",
    height: "520px",
    background: COLORS.white,
    borderRadius: "20px",
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "999999",
    fontFamily: FONT,
    border: `1px solid ${COLORS.border}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transformOrigin: "bottom right",
  });

  box.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
      color: ${COLORS.white};
      padding: 18px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    ">
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 15px; font-weight: 700; letter-spacing: -0.01em;">ChatSathi</div>
        <div style="font-size: 12px; opacity: 0.75; display: flex; align-items: center; gap: 6px; margin-top: 2px;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #4ade80; display: inline-block;"></span>
          Online now
        </div>
      </div>
      <div id="chat-close" style="
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.15);
        transition: background 0.2s;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </div>
    </div>

    <div id="chat-messages" style="
      flex: 1;
      padding: 20px 16px;
      overflow-y: auto;
      background: ${COLORS.bg};
      display: flex;
      flex-direction: column;
      gap: 4px;
    ">
      <div style="
        display: flex;
        gap: 8px;
        align-items: flex-start;
        margin-bottom: 4px;
      ">
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>
        <div style="
          background: ${COLORS.aiBubble};
          border: 1px solid ${COLORS.border};
          border-radius: 16px;
          border-top-left-radius: 4px;
          padding: 10px 14px;
          font-size: 13.5px;
          line-height: 1.5;
          color: ${COLORS.text};
          max-width: 80%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        ">
          👋 Hi there! How can I help you today?
        </div>
      </div>
    </div>

    <div style="
      padding: 14px 16px;
      border-top: 1px solid ${COLORS.border};
      background: ${COLORS.white};
      display: flex;
      gap: 8px;
      align-items: center;
    ">
      <input id="chat-input" type="text" style="
        flex: 1;
        padding: 11px 16px;
        border: 1.5px solid ${COLORS.border};
        border-radius: 12px;
        font-size: 14px;
        font-family: ${FONT};
        outline: none;
        background: ${COLORS.bg};
        color: ${COLORS.text};
        transition: border-color 0.2s, box-shadow 0.2s;
      " placeholder="Type your message..." />
      <button id="chat-send" style="
        width: 42px;
        height: 42px;
        border: none;
        background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
        color: ${COLORS.white};
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
      </button>
    </div>
  `;
  document.body.appendChild(box);

  // ─── FOCUS STYLES FOR INPUT ───
  const chatInput = box.querySelector("#chat-input");
  chatInput.addEventListener("focus", () => {
    chatInput.style.borderColor = COLORS.primary;
    chatInput.style.boxShadow = `0 0 0 3px ${COLORS.primaryLight}`;
  });
  chatInput.addEventListener("blur", () => {
    chatInput.style.borderColor = COLORS.border;
    chatInput.style.boxShadow = "none";
  });

  // ─── SEND BUTTON HOVER ───
  const chatSend = box.querySelector("#chat-send");
  chatSend.onmouseenter = () => {
    chatSend.style.boxShadow = `0 4px 16px ${COLORS.primaryGlow}`;
    chatSend.style.transform = "scale(1.05)";
  };
  chatSend.onmouseleave = () => {
    chatSend.style.boxShadow = "none";
    chatSend.style.transform = "scale(1)";
  };

  // ─── TOGGLE CHAT ───
  let isOpen = false;
  button.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      box.style.display = "flex";
      box.style.opacity = "0";
      box.style.transform = "scale(0.92) translateY(10px)";
      requestAnimationFrame(() => {
        box.style.opacity = "1";
        box.style.transform = "scale(1) translateY(0)";
      });
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    } else {
      box.style.opacity = "0";
      box.style.transform = "scale(0.92) translateY(10px)";
      setTimeout(() => {
        box.style.display = "none";
      }, 200);
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;
    }
  };

  box.querySelector("#chat-close").onclick = () => {
    isOpen = false;
    box.style.opacity = "0";
    box.style.transform = "scale(0.92) translateY(10px)";
    setTimeout(() => {
      box.style.display = "none";
    }, 200);
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;
  };

  // ─── CLOSE BUTTON HOVER ───
  const closeBtn = box.querySelector("#chat-close");
  closeBtn.onmouseenter = () => {
    closeBtn.style.background = "rgba(255,255,255,0.25)";
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.background = "rgba(255,255,255,0.15)";
  };

  const input = box.querySelector("#chat-input");
  const sendBtn = box.querySelector("#chat-send");
  const messageArea = box.querySelector("#chat-messages");

  // ─── ADD MESSAGE ───
  function addMessage(text, from) {
    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      display: "flex",
      gap: "8px",
      alignItems: "flex-start",
      justifyContent: from === "user" ? "flex-end" : "flex-start",
      marginBottom: "4px",
    });

    if (from === "ai") {
      const avatar = document.createElement("div");
      Object.assign(avatar.style, {
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: "0",
        marginTop: "2px",
      });
      avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
      wrapper.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.innerHTML = text;

    if (from === "user") {
      Object.assign(bubble.style, {
        maxWidth: "78%",
        padding: "10px 16px",
        borderRadius: "16px",
        borderTopRightRadius: "4px",
        fontSize: "13.5px",
        lineHeight: "1.5",
        background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
        color: COLORS.white,
        boxShadow: `0 2px 8px ${COLORS.primaryGlow}`,
      });
    } else {
      Object.assign(bubble.style, {
        maxWidth: "80%",
        padding: "10px 14px",
        borderRadius: "16px",
        borderTopLeftRadius: "4px",
        fontSize: "13.5px",
        lineHeight: "1.5",
        background: COLORS.aiBubble,
        color: COLORS.text,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      });
    }

    wrapper.appendChild(bubble);
    messageArea.appendChild(wrapper);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  // ─── TYPING INDICATOR ───
  function showTyping() {
    const wrapper = document.createElement("div");
    wrapper.id = "typing-indicator";
    Object.assign(wrapper.style, {
      display: "flex",
      gap: "8px",
      alignItems: "flex-start",
      marginBottom: "4px",
    });

    const avatar = document.createElement("div");
    Object.assign(avatar.style, {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      marginTop: "2px",
    });
    avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
    wrapper.appendChild(avatar);

    const dots = document.createElement("div");
    Object.assign(dots.style, {
      background: COLORS.aiBubble,
      border: `1px solid ${COLORS.border}`,
      borderRadius: "16px",
      borderTopLeftRadius: "4px",
      padding: "12px 18px",
      display: "flex",
      gap: "5px",
      alignItems: "center",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    });
    dots.innerHTML = `
      <span style="width:7px;height:7px;border-radius:50%;background:${COLORS.textLight};display:inline-block;animation:csDot 1.4s infinite ease-in-out both;animation-delay:0s"></span>
      <span style="width:7px;height:7px;border-radius:50%;background:${COLORS.textLight};display:inline-block;animation:csDot 1.4s infinite ease-in-out both;animation-delay:0.16s"></span>
      <span style="width:7px;height:7px;border-radius:50%;background:${COLORS.textLight};display:inline-block;animation:csDot 1.4s infinite ease-in-out both;animation-delay:0.32s"></span>
    `;
    wrapper.appendChild(dots);
    messageArea.appendChild(wrapper);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  function removeTyping() {
    const el = messageArea.querySelector("#typing-indicator");
    if (el) el.remove();
  }

  // ─── KEYFRAME ANIMATION ───
  const style = document.createElement("style");
  style.textContent = `
    @keyframes csDot {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    #chat-input::placeholder {
      color: #94a3b8;
      opacity: 1;
    }
    #chat-input::-webkit-input-placeholder { color: #94a3b8; }
    #chat-input::-moz-placeholder { color: #94a3b8; opacity: 1; }
    #chat-input:-ms-input-placeholder { color: #94a3b8; }
    #chat-messages::-webkit-scrollbar { width: 5px; }
    #chat-messages::-webkit-scrollbar-track { background: transparent; }
    #chat-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    #chat-messages::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `;
  document.head.appendChild(style);

  // ─── SEND HANDLER ───
  sendBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    showTyping();

    try {
      const response = await fetch(api_Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, message: text }),
      });

      const data = await response.json();
      removeTyping();
      addMessage(data || "Something went wrong. Please try again.", "ai");
    } catch (error) {
      console.log("error", error);
      removeTyping();
      addMessage("Something went wrong. Please try again later.", "ai");
    }
  };

  // ─── ENTER KEY ───
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // ─── RESPONSIVE: MOBILE ───
  const mq = window.matchMedia("(max-width: 480px)");
  function handleMobile(e) {
    if (e.matches) {
      Object.assign(box.style, {
        width: "100vw",
        height: "100vh",
        bottom: "0",
        right: "0",
        borderRadius: "0",
      });
    } else {
      Object.assign(box.style, {
        width: "380px",
        height: "520px",
        bottom: "100px",
        right: "24px",
        borderRadius: "20px",
      });
    }
  }
  mq.addEventListener("change", handleMobile);
  handleMobile(mq);
})();