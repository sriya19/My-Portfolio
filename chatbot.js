/* ============================================================
   Sriya AI — Talking Assistant
   A voice-enabled, avatar-driven chatbot that answers questions
   about Sriya Pothula. Runs fully client-side (no backend), so
   it is safe for GitHub Pages. Uses keyword scoring over a
   curated knowledge base + the Web Speech API for voice.
   ============================================================ */

(function () {
    'use strict';

    // ---- Knowledge base ------------------------------------------------
    // Each entry: keywords to match + a spoken/written answer.
    const KB = [
        {
            keywords: ['who are you', 'about you', 'yourself', 'introduce', 'who is sriya', 'tell me about'],
            answer: "Hi! I'm Sriya Pothula's AI assistant. Sriya is a Gen AI Engineer and Data Business Analyst based in Aldie, Virginia. She builds production-grade AI systems — RAG pipelines, semantic search, and LLM applications — and turns data into business decisions with Power BI and Snowflake. Ask me anything about her work, skills, projects, or experience!"
        },
        {
            keywords: ['role', 'looking for', 'focus', 'target', 'what kind of job', 'position', 'open to', 'hiring'],
            answer: "Sriya is focused on two kinds of roles: Gen AI Engineer — building RAG, LLM, and semantic search systems — and Data Business Analyst — delivering insights through Power BI, Snowflake, and SQL. She's open to opportunities in both areas."
        },
        {
            keywords: ['experience', 'work history', 'job', 'career', 'worked', 'employment'],
            answer: "Sriya has over 3.5 years of experience. Currently she's a Business Intelligence Analyst at Top Marble and Granite and an AI Trainer at Handshake AI. Earlier she was a Business Intelligence Intern at Top Marble and Granite, and before that a Senior Data Engineer on the SAP platform at Infosys for nearly three years. Want details on any of these?"
        },
        {
            keywords: ['top marble', 'granite', 'business intelligence analyst', 'stone dash', 'current job', 'current role'],
            answer: "At Top Marble and Granite, Sriya is a Business Intelligence Analyst. She's leading the development of Stone Dash, a SaaS platform that integrates Snowflake-backed analytics with a customer-facing inventory system. Her interactive Power BI and Snowflake dashboards gave real-time visibility into sales, inventory, and demand forecasting — contributing to a 33% revenue increase."
        },
        {
            keywords: ['handshake', 'ai trainer', 'trainer'],
            answer: "At Handshake AI, Sriya works as an AI Trainer. She builds and optimizes data preprocessing and transformation pipelines for structured and unstructured data, engineers scalable retrieval pipelines using vector databases and embeddings, and develops Python and SQL automation workflows for research and operations."
        },
        {
            keywords: ['infosys', 'sap', 'data engineer', 's/4hana', 'senior'],
            answer: "At Infosys, Sriya was a Senior Data Engineer on the SAP platform for almost three years. She built enterprise-scale Python and SQL automation pipelines that reduced manual reporting by around 30 hours per week, maintained data flows across SAP SD, TM, and S/4HANA for global clients, and resolved critical P1 and P2 data-integrity incidents."
        },
        {
            keywords: ['skill', 'tech', 'technology', 'tool', 'stack', 'programming', 'language', 'know'],
            answer: "Sriya's toolkit includes: Languages — Python, SQL, PySpark, DAX, and C++. Data platforms — Snowflake, PostgreSQL, Databricks, AWS, and MinIO. AI and ML — RAG, FAISS, vector databases, NLP, the OpenAI API, and HuggingFace. And for BI — Power BI, dashboard design, and data storytelling."
        },
        {
            keywords: ['gen ai', 'generative', 'llm', 'rag', 'retrieval', 'semantic search', 'embedding', 'vector', 'nlp'],
            answer: "On the Gen AI side, Sriya has built end-to-end RAG pipelines with embeddings and vector search, hybrid semantic plus keyword retrieval using pgvector and FAISS, and domain-specific question-answering systems. She works with the OpenAI API, HuggingFace, sentence transformers, and SBERT."
        },
        {
            keywords: ['project', 'built', 'portfolio', 'show me', 'work on'],
            answer: "Some highlights: ALFA8, a hybrid search data pipeline using PostgreSQL, pgvector, and FastAPI; a Clinical QA System using FAISS, HuggingFace, and SBERT for sub-second semantic retrieval; an AI-based Fraud Detection system on PySpark and Databricks; and a Metadata Catalog for U.S. mental health data with RAG-based question answering. Scroll to the Projects section to explore them!"
        },
        {
            keywords: ['alfa8', 'hybrid search', 'pgvector', 'fastapi'],
            answer: "ALFA8 is a hybrid search data pipeline Sriya built with Python, PostgreSQL, pgvector, FastAPI, and sentence transformers. It ingests documents into Postgres with pgvector for hybrid semantic and keyword retrieval, handles chunking, embedding generation, and vector indexing as a modular pipeline, and exposes REST APIs with tuned score weighting for better accuracy."
        },
        {
            keywords: ['clinical', 'mimic', 'healthcare', 'medical', 'qa system'],
            answer: "The Clinical QA System is a healthcare question-answering pipeline using Python, FAISS, HuggingFace, SBERT, and NLP. It indexes clinical documents for sub-second semantic retrieval, preprocesses unstructured clinical text with domain-aware embeddings, and includes an evaluation framework comparing performance against ground-truth QA pairs."
        },
        {
            keywords: ['fraud', 'detection', 'xgboost', 'spark'],
            answer: "Sriya's AI-based Fraud Detection system runs on PySpark and Databricks for real-time transaction monitoring. It applies Gradient Boosting and XGBoost models, with interactive Power BI dashboards delivering actionable insights."
        },
        {
            keywords: ['mental health', 'metadata', 'catalog', 'cdc', 'mindcube'],
            answer: "The Metadata Catalog for U.S. mental health data integrates CDC, SAMHSA, and Maryland Open Data with RAG-based question answering and LLM-powered insights. Sriya engineered semantic search over 14,000-plus dataset chunks, with AI visualizations using ParaView and QGIS for geospatial mapping."
        },
        {
            keywords: ['education', 'degree', 'university', 'study', 'college', 'masters', 'master', 'school'],
            answer: "Sriya holds a Master of Science in Data Analytics Engineering from George Mason University, completed December 2025 with a 3.77 GPA. She also has a Bachelor of Science in Electronics and Communications Engineering from SRKR Engineering College, earned in May 2020."
        },
        {
            keywords: ['gpa', 'grade', 'marks'],
            answer: "Sriya graduated from her Master's in Data Analytics Engineering at George Mason University with a 3.77 out of 4.0 GPA."
        },
        {
            keywords: ['certification', 'certificate', 'certified', 'google'],
            answer: "Sriya holds the Google Project Management Certification, covering project initiation, planning, execution, and Agile methodologies. You can find the verification link in the Certifications section."
        },
        {
            keywords: ['power bi', 'dashboard', 'analyst', 'business analyst', 'snowflake', 'visualization', 'reporting', 'bi'],
            answer: "As a Data Business Analyst, Sriya designs interactive Power BI and Snowflake dashboards for real-time visibility into sales, inventory, and demand forecasting. She architects dimensional data models and SQL ETL pipelines, and her work at Top Marble and Granite contributed to a 33% revenue increase."
        },
        {
            keywords: ['contact', 'email', 'reach', 'hire', 'get in touch', 'connect', 'message'],
            answer: "You can reach Sriya by email at sriyasriya569@gmail.com, or connect on LinkedIn and GitHub via the links in the Contact section. She'd love to hear from you!"
        },
        {
            keywords: ['location', 'where', 'based', 'live', 'relocate', 'city'],
            answer: "Sriya is based in Aldie, Virginia, in the Washington D.C. metro area."
        },
        {
            keywords: ['resume', 'cv', 'download'],
            answer: "You can download Sriya's full resume using the 'Download Resume' button in the hero section at the top of the page."
        },
        {
            keywords: ['hello', 'hi', 'hey', 'greetings', 'howdy'],
            answer: "Hello! 👋 I'm Sriya's AI assistant. Ask me about her experience, skills, projects, education, or how to get in touch."
        },
        {
            keywords: ['thank', 'thanks', 'appreciate'],
            answer: "You're very welcome! Feel free to ask anything else about Sriya, or reach out to her directly at sriyasriya569@gmail.com."
        }
    ];

    const FALLBACK = "Great question! I can tell you about Sriya's experience, skills, projects, education, certifications, or how to contact her. Try asking something like \"What are her AI skills?\" or \"Tell me about her projects.\"";

    const SUGGESTIONS = [
        'Who is Sriya?',
        'What roles is she looking for?',
        'Her AI & Gen AI skills',
        'Tell me about her projects',
        'Her experience',
        'How can I contact her?'
    ];

    // ---- Matching engine ----------------------------------------------
    function findAnswer(query) {
        const q = ' ' + query.toLowerCase().replace(/[^\w\s]/g, ' ') + ' ';
        let best = null;
        let bestScore = 0;

        KB.forEach(function (entry) {
            let score = 0;
            entry.keywords.forEach(function (kw) {
                if (q.indexOf(kw.toLowerCase()) !== -1) {
                    // Longer keyword phrases are stronger signals.
                    score += kw.split(' ').length * 2 + kw.length * 0.05;
                }
            });
            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        });

        return best && bestScore > 0 ? best.answer : FALLBACK;
    }

    // ---- DOM build -----------------------------------------------------
    function el(tag, cls, html) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html !== undefined) e.innerHTML = html;
        return e;
    }

    const launcher = el('div', 'ai-bot-launcher');
    launcher.setAttribute('aria-label', "Chat with Sriya's AI");
    launcher.innerHTML =
        '<img src="profile.jpg" alt="Sriya AI" class="ai-bot-avatar-img">' +
        '<span class="ai-bot-pulse"></span>' +
        '<span class="ai-bot-launcher-label">Ask my AI about me</span>';

    const windowEl = el('div', 'ai-bot-window');
    windowEl.setAttribute('aria-hidden', 'true');
    windowEl.innerHTML =
        '<div class="ai-bot-header">' +
            '<div class="ai-bot-header-avatar" id="aiBotAvatar">' +
                '<img src="profile.jpg" alt="Sriya AI">' +
                '<span class="ai-bot-status"></span>' +
            '</div>' +
            '<div class="ai-bot-header-info">' +
                '<h4>Sriya AI</h4>' +
                '<p>Ask me anything about Sriya</p>' +
            '</div>' +
            '<div class="ai-bot-header-actions">' +
                '<button class="ai-bot-icon-btn" id="aiBotMute" title="Toggle voice"><i class="fas fa-volume-up"></i></button>' +
                '<button class="ai-bot-icon-btn" id="aiBotClose" title="Close"><i class="fas fa-times"></i></button>' +
            '</div>' +
        '</div>' +
        '<div class="ai-bot-messages" id="aiBotMessages"></div>' +
        '<div class="ai-bot-suggestions" id="aiBotSuggestions"></div>' +
        '<form class="ai-bot-input" id="aiBotForm">' +
            '<input type="text" id="aiBotInput" placeholder="Type your question..." autocomplete="off">' +
            '<button type="submit" class="ai-bot-send"><i class="fas fa-paper-plane"></i></button>' +
        '</form>';

    document.body.appendChild(launcher);
    document.body.appendChild(windowEl);

    const messagesEl = windowEl.querySelector('#aiBotMessages');
    const suggestionsEl = windowEl.querySelector('#aiBotSuggestions');
    const formEl = windowEl.querySelector('#aiBotForm');
    const inputEl = windowEl.querySelector('#aiBotInput');
    const avatarEl = windowEl.querySelector('#aiBotAvatar');
    const muteBtn = windowEl.querySelector('#aiBotMute');
    const closeBtn = windowEl.querySelector('#aiBotClose');

    // ---- Voice (Web Speech API) ---------------------------------------
    let voiceEnabled = true;
    let chosenVoice = null;

    function pickVoice() {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        // Prefer a natural female English voice.
        const prefs = ['Google US English', 'Samantha', 'Microsoft Aria', 'Microsoft Zira', 'Google UK English Female'];
        for (const name of prefs) {
            const v = voices.find(function (vo) { return vo.name === name; });
            if (v) { chosenVoice = v; return; }
        }
        chosenVoice = voices.find(function (v) { return /female/i.test(v.name) && /en/i.test(v.lang); })
            || voices.find(function (v) { return /en-US/i.test(v.lang); })
            || voices[0] || null;
    }

    if ('speechSynthesis' in window) {
        pickVoice();
        window.speechSynthesis.onvoiceschanged = pickVoice;
    }

    function speak(text) {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const clean = text.replace(/<[^>]+>/g, '').replace(/[👋]/g, '');
        const utter = new SpeechSynthesisUtterance(clean);
        if (chosenVoice) utter.voice = chosenVoice;
        utter.rate = 1.02;
        utter.pitch = 1.05;
        utter.onstart = function () { avatarEl.classList.add('talking'); };
        utter.onend = function () { avatarEl.classList.remove('talking'); };
        utter.onerror = function () { avatarEl.classList.remove('talking'); };
        window.speechSynthesis.speak(utter);
    }

    function stopSpeaking() {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        avatarEl.classList.remove('talking');
    }

    // ---- Message rendering --------------------------------------------
    function scrollDown() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addMessage(text, who) {
        const msg = el('div', 'ai-bot-msg ' + who, text);
        messagesEl.appendChild(msg);
        scrollDown();
        return msg;
    }

    function showTyping() {
        const t = el('div', 'ai-bot-typing');
        t.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(t);
        scrollDown();
        return t;
    }

    function botRespond(query) {
        const answer = findAnswer(query);
        const typing = showTyping();
        // Simulate a brief "thinking" delay for realism.
        setTimeout(function () {
            typing.remove();
            addMessage(answer, 'bot');
            speak(answer);
        }, 650);
    }

    function handleQuery(text) {
        const q = text.trim();
        if (!q) return;
        addMessage(q, 'user');
        inputEl.value = '';
        botRespond(q);
    }

    // ---- Suggestions ---------------------------------------------------
    function renderSuggestions() {
        suggestionsEl.innerHTML = '';
        SUGGESTIONS.forEach(function (s) {
            const chip = el('button', 'ai-bot-chip', s);
            chip.type = 'button';
            chip.addEventListener('click', function () { handleQuery(s); });
            suggestionsEl.appendChild(chip);
        });
    }

    // ---- Open / close --------------------------------------------------
    let greeted = false;

    function openBot() {
        windowEl.classList.add('is-open');
        launcher.classList.add('is-open');
        windowEl.setAttribute('aria-hidden', 'false');
        setTimeout(function () { inputEl.focus(); }, 350);
        if (!greeted) {
            greeted = true;
            renderSuggestions();
            setTimeout(function () {
                const greeting = "Hi! 👋 I'm Sriya's AI twin. Ask me about her experience, Gen AI skills, projects, or how to get in touch!";
                addMessage(greeting, 'bot');
                speak(greeting);
            }, 400);
        }
    }

    function closeBot() {
        windowEl.classList.remove('is-open');
        launcher.classList.remove('is-open');
        windowEl.setAttribute('aria-hidden', 'true');
        stopSpeaking();
    }

    // ---- Events --------------------------------------------------------
    launcher.addEventListener('click', openBot);
    closeBtn.addEventListener('click', closeBot);

    muteBtn.addEventListener('click', function () {
        voiceEnabled = !voiceEnabled;
        muteBtn.innerHTML = voiceEnabled
            ? '<i class="fas fa-volume-up"></i>'
            : '<i class="fas fa-volume-mute"></i>';
        muteBtn.classList.toggle('muted', !voiceEnabled);
        if (!voiceEnabled) stopSpeaking();
    });

    formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        handleQuery(inputEl.value);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && windowEl.classList.contains('is-open')) closeBot();
    });
})();
