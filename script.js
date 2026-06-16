/* ==========================================================================
   TYPING ANIMATION IN HERO SECTION
   ========================================================================== */
const phrases = [
    "InfoSec enthusiast",
    "CTF enjoyer",
    "Workflow Automation",
    "Web developer",
    "Business Process Analysis"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById("typed-text");
const typingSpeed = 100;
const erasingSpeed = 50;
const delayBetweenPhrases = 2000;

function typePhrase() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typePhrase, delayBetweenPhrases);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typePhrase, 500);
    } else {
        setTimeout(typePhrase, isDeleting ? erasingSpeed : typingSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    typePhrase();
});

/* ==========================================================================
   TERMINAL SIMULATOR LOGIC
   ========================================================================== */
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

const commands = {
    help: () => `Available commands:<br>
    - <span class="result-msg">about</span> : About me, interests, and goals<br>
    - <span class="result-msg">skills</span> : Tech stack and automation skills<br>
    - <span class="result-msg">play</span> : Play Kanye West - Can't Tell Me Nothing<br>
    - <span class="result-msg">pause</span> : Pause audio playback<br>
    - <span class="result-msg">clear</span> : Clear the terminal screen`,
    
    about: () => `<b>Khasanov Rishat (layf)</b><br>
    I am a high school student (10th grade) passionately focused on Information Security.<br>
    I enjoy finding vulnerabilities, participating in CTF competitions, and automating complex workflows.<br>
    I also love analyzing business processes: building solutions that deliver real-world business value.`,
    
    skills: () => `<b>My Tech Stack:</b><br>
    - <span class="result-msg">Python</span>: telegram bots, web scrapers, data analysis, API integrations.<br>
    - <span class="result-msg">Linux / Bash / Git</span>: system administration, shell scripting, automation.<br>
    - <span class="result-msg">Docker / Docker-Compose</span>: containerization and deployment environments.<br>
    - <span class="result-msg">Web (HTML/CSS/JS)</span>: building modern web interfaces and services.<br>
    Leveraging programming as a tool to solve routine problems and build custom toolkits.`,
    

    clear: () => {
        terminalOutput.innerHTML = '';
        return '';
    }
};

let commandHistory = [];
let historyIndex = -1;

const availableCommands = ["help", "about", "skills", "play", "pause", "clear"];

terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const fullInput = terminalInput.value.trim();
        terminalInput.value = '';
        
        if (!fullInput) return;
        
        // Add to history
        commandHistory.push(fullInput);
        historyIndex = commandHistory.length;
        
        const args = fullInput.split(" ");
        const cmd = args[0].toLowerCase();
        
        // Print command echo
        const echoLine = document.createElement("p");
        echoLine.className = "term-line";
        echoLine.innerHTML = `<span class="term-prompt">layf@root:~$</span> <span class="input-echo">${escapeHtml(fullInput)}</span>`;
        terminalOutput.appendChild(echoLine);
        
        let output = "";
        
        if (cmd === "play") {
            output = "Playing Kanye West - Can't Tell Me Nothing...";
            startMusic();
        } else if (cmd === "pause") {
            output = "Playback paused.";
            pauseMusic();
        } else if (commands[cmd]) {
            output = commands[cmd]();
        } else {
            output = `<span class="error-msg">Error: command '${escapeHtml(cmd)}' not found.</span> Type 'help' for available commands.`;
        }
        
        if (output) {
            const resultLine = document.createElement("p");
            resultLine.className = "term-line";
            resultLine.innerHTML = output;
            terminalOutput.appendChild(resultLine);
        }
        
        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            terminalInput.value = '';
        }
    } else if (e.key === "Tab") {
        e.preventDefault();
        const currentInput = terminalInput.value.toLowerCase();
        if (currentInput) {
            const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput));
            if (matches.length === 1) {
                terminalInput.value = matches[0];
            }
        }
    }
});

// Helper function to escape HTML to prevent XSS in input echoes
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Focus input on terminal card click
document.querySelector(".terminal-section").addEventListener("click", () => {
    terminalInput.focus();
});


/* ==========================================================================
   AUDIO PLAYER (KANYE WEST - CAN'T TELL ME NOTHING)
   ========================================================================== */
const audio = new Audio('kanye.mp3');
audio.loop = true;
let isPlaying = false;

const playPauseBtn = document.getElementById("play-pause-btn");
const equalizer = document.getElementById("equalizer");
const trackNameElement = document.querySelector(".track-name");

function startMusic() {
    if (isPlaying) return;
    isPlaying = true;
    
    audio.play().catch(err => {
        console.log("Audio playback failed: ", err);
    });
    
    // UI Update
    equalizer.classList.add("active");
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    trackNameElement.textContent = "Can't Tell Me Nothing";
}

function pauseMusic() {
    if (!isPlaying) return;
    isPlaying = false;
    audio.pause();
    
    // UI Update
    equalizer.classList.remove("active");
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    trackNameElement.textContent = "Can't Tell Me Nothing (Paused)";
}

playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseMusic();
        
        // Log to terminal
        const echoLine = document.createElement("p");
        echoLine.className = "term-line";
        echoLine.innerHTML = `<span class="term-prompt">layf@root:~$</span> <span class="input-echo">pause</span>`;
        terminalOutput.appendChild(echoLine);
        
        const resultLine = document.createElement("p");
        resultLine.className = "term-line result-msg";
        resultLine.innerHTML = "Playback paused.";
        terminalOutput.appendChild(resultLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    } else {
        startMusic();
        
        // Log to terminal
        const echoLine = document.createElement("p");
        echoLine.className = "term-line";
        echoLine.innerHTML = `<span class="term-prompt">layf@root:~$</span> <span class="input-echo">play</span>`;
        terminalOutput.appendChild(echoLine);
        
        const resultLine = document.createElement("p");
        resultLine.className = "term-line result-msg";
        resultLine.innerHTML = "Playing Kanye West - Can't Tell Me Nothing...";
        terminalOutput.appendChild(resultLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});
