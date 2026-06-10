/* ===================================================================
   TALKING AVATAR — Split-screen AI assistant with voice & animation
   =================================================================== */

(function () {
    'use strict';

    // Import the knowledge base from chatbot.js (we'll share it)
    // For now, inline a minimal KB - can be extended
    const KB = [
        {
            keywords: ['who are you', 'about you', 'yourself', 'introduce', 'who is sriya', 'tell me about'],
            answer: "Hi! I'm Sriya Pothula's AI assistant. Sriya is a Gen AI Engineer and Data Business Analyst based in Aldie, Virginia. She builds production-grade AI systems — RAG pipelines, semantic search, and LLM applications — and turns data into business decisions with Power BI and Snowflake. Ask me anything about her work, skills, projects, or experience!"
        },
        {
            keywords: ['role', 'looking for', 'focus', 'target', 'what kind of job', 'position'],
            answer: "Sriya is focused on two kinds of roles: Gen AI Engineer — building RAG, LLM, and semantic search systems — and Data Business Analyst — delivering insights through Power BI, Snowflake, and SQL."
        },
        {
            keywords: ['skill', 'tech', 'technology', 'tool', 'stack', 'programming'],
            answer: "Sriya's toolkit includes Python, SQL, PySpark, DAX, C++, Snowflake, PostgreSQL, Databricks, AWS, MinIO, RAG, FAISS, vector databases, NLP, OpenAI API, HuggingFace, Power BI, and more!"
        },
        {
            keywords: ['project', 'built', 'portfolio'],
            answer: "Some highlights: ALFA8 hybrid search pipeline, Clinical QA System with FAISS, AI Fraud Detection on PySpark, and a Metadata Catalog for U.S. mental health data with RAG. Scroll through the portfolio to explore!"
        },
        {
            keywords: ['experience', 'work', 'job', 'career'],
            answer: "Sriya has 3.5+ years of experience. She's currently a Business Intelligence Analyst at Top Marble & Granite and an AI Trainer at Handshake AI. Before that, she was a Senior Data Engineer at Infosys for nearly three years."
        },
        {
            keywords: ['education', 'degree', 'university', 'study'],
            answer: "Sriya holds a Master of Science in Data Analytics Engineering from George Mason University with a 3.77 GPA, and a Bachelor's in Electronics & Communications Engineering from SRKR Engineering College."
        },
        {
            keywords: ['contact', 'email', 'reach', 'hire', 'connect'],
            answer: "You can reach Sriya at sriyasriya569@gmail.com, or connect via LinkedIn and GitHub. She'd love to hear from you!"
        },
        {
            keywords: ['joke', 'funny', 'make me laugh'],
            answer: [
                "Why did the data scientist break up with the neural network? There was no connection... except the fully-connected layer! 😄",
                "Why do Python programmers prefer dark mode? Because light attracts bugs! 🐛",
                "How does Sriya organize a party? She plans it in SQL — then JOINs everyone together! 🎉",
                "I asked the LLM for a joke. It hallucinated three punchlines and cited a non-existent paper. 😅"
            ]
        },
        {
            keywords: ['fun fact', 'interesting', 'surprise'],
            answer: [
                "Fun fact: Sriya's automation at Infosys saved ~30 hours weekly — that's like gifting a 4-day month every year! ⏱️",
                "Fun fact: Her dashboards helped drive a 33% revenue increase. Numbers AND results! 📈",
                "Fun fact: She searches 14,000+ dataset chunks in under a second. Faster than picking a Netflix show! 🍿"
            ]
        },
        {
            keywords: ['hello', 'hi', 'hey', 'greetings'],
            answer: "Hello! 👋 I'm Sriya's AI twin. Ask me about her experience, skills, projects, or just chat!"
        },
        {
            keywords: ['thank', 'thanks'],
            answer: "You're very welcome! Feel free to ask anything else, or reach out to Sriya directly!"
        }
    ];

    const FALLBACK = "Hmm, I don't have a great answer for that yet! But I know all about Sriya's projects, skills, experience — or I can tell you a joke. What sounds good? 😊";

    const SUGGESTIONS = [
        'Who is Sriya?',
        'Tell me a joke 😄',
        'Her AI skills',
        'Tell me about her projects',
        'Her experience',
        'How can I contact her?'
    ];

    // Match query to answer
    function findAnswer(query) {
        const q = ' ' + query.toLowerCase().replace(/[^\w\s]/g, ' ') + ' ';
        let best = null;
        let bestScore = 0;

        KB.forEach(function (entry) {
            let score = 0;
            entry.keywords.forEach(function (kw) {
                if (q.indexOf(kw.toLowerCase()) !== -1) {
                    score += kw.split(' ').length * 2 + kw.length * 0.05;
                }
            });
            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        });

        return best && bestScore > 0 ? resolve(best.answer) : FALLBACK;
    }

    function resolve(answer) {
        if (Array.isArray(answer)) {
            return answer[Math.floor(Math.random() * answer.length)];
        }
        return answer;
    }

    // Voice
    let voiceEnabled = true;
    let chosenVoice = null;

    function pickVoice() {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        const prefs = ['Google US English', 'Samantha', 'Microsoft Aria', 'Microsoft Zira', 'Google UK English Female'];
        for (const name of prefs) {
            const v = voices.find(vo => vo.name === name);
            if (v) { chosenVoice = v; return; }
        }
        chosenVoice = voices.find(v => /female/i.test(v.name) && /en/i.test(v.lang))
            || voices.find(v => /en-US/i.test(v.lang))
            || voices[0] || null;
    }

    if ('speechSynthesis' in window) {
        pickVoice();
        window.speechSynthesis.onvoiceschanged = pickVoice;
    }

    const avatarDisplay = document.querySelector('.avatar-display');
    const avatarVideo = document.querySelector('.avatar-image-frame video');

    function speak(text) {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const clean = text.replace(/<[^>]+>/g, '').replace(/[👋😄🐛🎉😅⏱️📈🍿😊]/g, '');
        const utter = new SpeechSynthesisUtterance(clean);
        if (chosenVoice) utter.voice = chosenVoice;
        utter.rate = 1.02;
        utter.pitch = 1.05;
        utter.onstart = function () {
            if (avatarDisplay) avatarDisplay.classList.add('talking');
            if (avatarVideo) {
                avatarVideo.playbackRate = 1.0; // Normal speed when talking
                avatarVideo.play();
            }
        };
        utter.onend = function () {
            if (avatarDisplay) avatarDisplay.classList.remove('talking');
            if (avatarVideo) {
                avatarVideo.playbackRate = 0.5; // Slow motion when idle
            }
        };
        utter.onerror = function () {
            if (avatarDisplay) avatarDisplay.classList.remove('talking');
            if (avatarVideo) {
                avatarVideo.playbackRate = 0.5;
            }
        };
        window.speechSynthesis.speak(utter);
    }

    function stopSpeaking() {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (avatarDisplay) avatarDisplay.classList.remove('talking');
        if (avatarVideo) {
            avatarVideo.playbackRate = 0.5; // Slow motion when stopped
        }
    }

    // UI
    const messagesArea = document.querySelector('.avatar-messages-area');
    const suggestionsEl = document.querySelector('.avatar-suggestions');
    const inputEl = document.querySelector('.avatar-input-area input');
    const formEl = document.querySelector('.avatar-input-area');
    const container = document.querySelector('.talking-avatar-container');
    const launcher = document.querySelector('.avatar-launcher');
    const closeBtn = document.querySelector('.avatar-close-btn');

    function scrollDown() {
        if (messagesArea) messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function addMessage(text, who) {
        const msg = document.createElement('div');
        msg.className = 'avatar-message ' + who;
        msg.innerHTML = text;
        messagesArea.appendChild(msg);
        scrollDown();
    }

    function showTyping() {
        const t = document.createElement('div');
        t.className = 'avatar-typing-indicator';
        t.innerHTML = '<span></span><span></span><span></span>';
        messagesArea.appendChild(t);
        scrollDown();
        return t;
    }

    function handleQuery(query) {
        const q = query.trim();
        if (!q) return;
        addMessage(q, 'user');
        if (inputEl) inputEl.value = '';

        const typing = showTyping();
        setTimeout(function () {
            typing.remove();
            const answer = findAnswer(q);
            addMessage(answer, 'bot');
            speak(answer);
        }, 700);
    }

    function renderSuggestions() {
        if (!suggestionsEl) return;
        suggestionsEl.innerHTML = '';
        SUGGESTIONS.forEach(function (s) {
            const chip = document.createElement('button');
            chip.className = 'avatar-suggestion-chip';
            chip.textContent = s;
            chip.addEventListener('click', function () {
                handleQuery(s);
            });
            suggestionsEl.appendChild(chip);
        });
    }

    let greeted = false;

    function openAvatar() {
        if (container) {
            container.classList.add('active');
            if (inputEl) setTimeout(() => inputEl.focus(), 400);

            if (!greeted) {
                greeted = true;
                renderSuggestions();
                setTimeout(function () {
                    const greeting = "Hi! 👋 I'm Sriya's AI twin. Ask me about her experience, skills, projects, or how to get in touch!";
                    addMessage(greeting, 'bot');
                    speak(greeting);
                }, 500);
            }
        }
    }

    function closeAvatar() {
        if (container) container.classList.remove('active');
        stopSpeaking();
    }

    // Events
    if (launcher) launcher.addEventListener('click', openAvatar);
    if (closeBtn) closeBtn.addEventListener('click', closeAvatar);

    if (formEl) {
        formEl.addEventListener('submit', function (e) {
            e.preventDefault();
            if (inputEl) handleQuery(inputEl.value);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && container && container.classList.contains('active')) {
            closeAvatar();
        }
    });

    // Initialize video at slow playback when idle
    if (avatarVideo) {
        avatarVideo.playbackRate = 0.5;
    }
})();
