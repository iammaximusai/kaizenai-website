/* ═══════════════════════════════════════════════════════════
   KaizenAI — Embeddable Lead Capture Chatbot Widget
   Drop this script on any page: <script src="chatbot.js"></script>
   ═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const API_URL = 'https://dashboard.kaizenai.agency/api/lead-chat';
    const SESSION_KEY = 'kaizen_chat_session';
    const HISTORY_KEY = 'kaizen_chat_history';

    // Generate or retrieve session ID
    function getSessionId() {
        let id = localStorage.getItem(SESSION_KEY);
        if (!id) {
            id = 'ks_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
            localStorage.setItem(SESSION_KEY, id);
        }
        return id;
    }

    // Get/save chat history for persistence across page loads
    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        } catch { return []; }
    }

    function saveHistory(messages) {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-30)));
        } catch { /* storage full, ignore */ }
    }

    // ─── Inject Styles ──────────────────────────────────────────
    const css = `
        #kaizen-chat-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6c5ce7, #00cec9);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 24px rgba(108, 92, 231, 0.4);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            animation: kaizen-fab-pulse 3s ease-in-out infinite;
        }
        #kaizen-chat-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 32px rgba(108, 92, 231, 0.6);
        }
        #kaizen-chat-fab.open {
            transform: rotate(45deg) scale(1);
            background: #333;
            animation: none;
        }
        @keyframes kaizen-fab-pulse {
            0%, 100% { box-shadow: 0 4px 24px rgba(108, 92, 231, 0.4); }
            50% { box-shadow: 0 4px 32px rgba(108, 92, 231, 0.7), 0 0 0 8px rgba(108, 92, 231, 0.1); }
        }

        #kaizen-chat-window {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 380px;
            max-height: 520px;
            background: #12121a;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            box-shadow: 0 16px 64px rgba(0,0,0,0.6);
            z-index: 99999;
            display: none;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            animation: kaizen-slide-up 0.3s ease;
        }
        #kaizen-chat-window.visible {
            display: flex;
        }
        @keyframes kaizen-slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .kaizen-chat-header {
            background: linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(0, 206, 201, 0.1));
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .kaizen-chat-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6c5ce7, #00cec9);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }
        .kaizen-chat-header-text h4 {
            margin: 0;
            font-size: 14px;
            font-weight: 700;
            color: #f0f0f5;
        }
        .kaizen-chat-header-text p {
            margin: 2px 0 0;
            font-size: 11px;
            color: #8888a0;
        }
        .kaizen-online-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #00e676;
            display: inline-block;
            margin-right: 4px;
            animation: kaizen-dot-pulse 2s ease-in-out infinite;
        }
        @keyframes kaizen-dot-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .kaizen-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: 280px;
            max-height: 340px;
            scrollbar-width: thin;
            scrollbar-color: #333 transparent;
        }
        .kaizen-chat-messages::-webkit-scrollbar { width: 4px; }
        .kaizen-chat-messages::-webkit-scrollbar-track { background: transparent; }
        .kaizen-chat-messages::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

        .kaizen-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 13px;
            line-height: 1.5;
            word-wrap: break-word;
            animation: kaizen-msg-in 0.25s ease;
        }
        @keyframes kaizen-msg-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .kaizen-msg.bot {
            align-self: flex-start;
            background: #1c1c28;
            color: #e0e0ea;
            border-bottom-left-radius: 4px;
        }
        .kaizen-msg.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
            color: white;
            border-bottom-right-radius: 4px;
        }
        .kaizen-msg.typing {
            background: #1c1c28;
            color: #8888a0;
        }
        .kaizen-typing-dots span {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #8888a0;
            margin: 0 2px;
            animation: kaizen-bounce 1.4s ease-in-out infinite;
        }
        .kaizen-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .kaizen-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes kaizen-bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-6px); }
        }

        .kaizen-chat-input-area {
            padding: 12px 16px;
            border-top: 1px solid rgba(255,255,255,0.06);
            display: flex;
            gap: 8px;
            background: #0f0f17;
        }
        .kaizen-chat-input-area input {
            flex: 1;
            background: #1c1c28;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 10px 14px;
            color: #f0f0f5;
            font-family: inherit;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s;
        }
        .kaizen-chat-input-area input:focus {
            border-color: #6c5ce7;
        }
        .kaizen-chat-input-area input::placeholder {
            color: #55556a;
        }
        .kaizen-chat-input-area button {
            background: #6c5ce7;
            border: none;
            border-radius: 8px;
            width: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: background 0.2s;
            flex-shrink: 0;
        }
        .kaizen-chat-input-area button:hover { background: #7c6cf0; }
        .kaizen-chat-input-area button:disabled { background: #333; cursor: default; }

        .kaizen-powered {
            text-align: center;
            padding: 6px;
            font-size: 10px;
            color: #44445a;
            background: #0a0a0f;
        }
        .kaizen-powered a {
            color: #6c5ce7;
            text-decoration: none;
        }

        @media (max-width: 480px) {
            #kaizen-chat-window {
                bottom: 0;
                right: 0;
                left: 0;
                width: 100%;
                max-height: 100vh;
                border-radius: 16px 16px 0 0;
            }
            #kaizen-chat-fab {
                bottom: 16px;
                right: 16px;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // ─── Build DOM ──────────────────────────────────────────────
    // FAB (Floating Action Button)
    const fab = document.createElement('button');
    fab.id = 'kaizen-chat-fab';
    fab.innerHTML = '⚡';
    fab.title = 'Chat with Maximus AI';
    document.body.appendChild(fab);

    // Chat Window
    const win = document.createElement('div');
    win.id = 'kaizen-chat-window';
    win.innerHTML = `
        <div class="kaizen-chat-header">
            <div class="kaizen-chat-avatar">⚡</div>
            <div class="kaizen-chat-header-text">
                <h4>Maximus AI</h4>
                <p><span class="kaizen-online-dot"></span>Online — KaizenAI Agency</p>
            </div>
        </div>
        <div class="kaizen-chat-messages" id="kaizen-messages"></div>
        <div class="kaizen-chat-input-area">
            <input type="text" id="kaizen-input" placeholder="Type a message..." autocomplete="off">
            <button id="kaizen-send">▶</button>
        </div>
        <div class="kaizen-powered">Powered by <a href="https://kaizenai.agency" target="_blank">KaizenAI</a></div>
    `;
    document.body.appendChild(win);

    const messagesEl = document.getElementById('kaizen-messages');
    const inputEl = document.getElementById('kaizen-input');
    const sendBtn = document.getElementById('kaizen-send');
    const sessionId = getSessionId();
    let isOpen = false;
    let isSending = false;
    let hasGreeted = false;

    // ─── Functions ──────────────────────────────────────────────
    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `kaizen-msg ${type}`;
        msg.textContent = text;
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        // Save to history
        const history = getHistory();
        history.push({ text, type });
        saveHistory(history);

        return msg;
    }

    function showTyping() {
        const msg = document.createElement('div');
        msg.className = 'kaizen-msg bot typing';
        msg.id = 'kaizen-typing';
        msg.innerHTML = '<div class="kaizen-typing-dots"><span></span><span></span><span></span></div>';
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return msg;
    }

    function removeTyping() {
        const el = document.getElementById('kaizen-typing');
        if (el) el.remove();
    }

    async function sendMessage(text) {
        if (isSending || !text.trim()) return;
        isSending = true;
        sendBtn.disabled = true;

        addMessage(text, 'user');
        inputEl.value = '';
        showTyping();

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, sessionId }),
            });

            removeTyping();

            if (res.status === 429) {
                addMessage("I'm getting a lot of messages right now. Give me a moment and try again!", 'bot');
            } else {
                const data = await res.json();
                if (data.response) {
                    addMessage(data.response, 'bot');
                } else if (data.error) {
                    addMessage("Something went wrong. Try again or email maximus@kaizenai.agency", 'bot');
                }
            }
        } catch (err) {
            removeTyping();
            addMessage("Connection issue. Please try again in a moment.", 'bot');
        }

        isSending = false;
        sendBtn.disabled = false;
        inputEl.focus();
    }

    function toggleChat() {
        isOpen = !isOpen;
        win.classList.toggle('visible', isOpen);
        fab.classList.toggle('open', isOpen);
        fab.innerHTML = isOpen ? '✕' : '⚡';

        if (isOpen) {
            inputEl.focus();
            if (!hasGreeted) {
                hasGreeted = true;
                // Restore history from localStorage
                const history = getHistory();
                if (history.length > 0) {
                    history.forEach(m => {
                        const msg = document.createElement('div');
                        msg.className = `kaizen-msg ${m.type}`;
                        msg.textContent = m.text;
                        messagesEl.appendChild(msg);
                    });
                    messagesEl.scrollTop = messagesEl.scrollHeight;
                } else {
                    // First-time greeting
                    setTimeout(() => {
                        addMessage("Hey! 👋 I'm Maximus, the AI behind KaizenAI. I help businesses automate their operations so they can focus on growth. What kind of business are you running?", 'bot');
                    }, 500);
                }
            }
        }
    }

    // ─── Event Listeners ────────────────────────────────────────
    fab.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', () => {
        sendMessage(inputEl.value);
    });

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputEl.value);
        }
    });

    // Auto-open after 8 seconds on first visit
    if (!localStorage.getItem('kaizen_chat_opened')) {
        setTimeout(() => {
            if (!isOpen) {
                toggleChat();
                localStorage.setItem('kaizen_chat_opened', '1');
            }
        }, 8000);
    }

    console.log('⚡ KaizenAI Chatbot loaded — session:', sessionId);
})();
